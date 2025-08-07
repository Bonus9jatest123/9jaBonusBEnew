import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { saveImage, validateOrder, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
import { Offer, validateFileInput, validateOffer } from '@/models/offer';
import { User } from '@/models/user';


// Disable Next.js default body parser (for multer)

// --- Multer setup ---
const upload = multer({ storage: multer.memoryStorage() });
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) =>
    new Promise((resolve, reject) => {
        fn(req, res, (result: unknown) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });

// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDb();

        // Middleware: JWT Authorization (for POST and PUT)
        if (req.method === 'POST' || req.method === 'PUT') {
            await new Promise((resolve, reject) =>
                authorize(req, res, (result: unknown) => {
                    if (result instanceof Error) return reject(result);
                    return resolve(result);
                })
            );
        }
        // Multer: Only for POST
        if (req.method === 'POST') {
            try {
                await runMiddleware(req, res, upload.fields([{ name: 'logo' }, { name: 'infoImage' }]));
            } catch (error: any) {
                return res.status(405).json({ message: error.message });
            }
        }
        // if (req.method === 'POST') {
        //     try {
        //         const { error } = validateOrder(req.body);
        //         if (error) return res.status(400).send(error.details[0].message);

        //         const user = await User.findById(req.body.id);
        //         if (!user)
        //             return res.status(404).send('The offer with the given ID does not exist.');
        //         const originalOrder = user.order;
        //         const newOrder = parseInt(req.body.order);
        //         if (originalOrder === undefined) {
        //             return res.status(400).send('Original order is missing for this odd.');
        //         }
        //         if (originalOrder !== newOrder) {
        //             offer.order = newOrder;
        //             await offer.save()
        //             if (newOrder > originalOrder) {
        //                 await Offer.updateMany(
        //                     {
        //                         order: { $gt: originalOrder, $lte: newOrder },
        //                         _id: { $ne: offer._id },
        //                     },
        //                     { $inc: { order: -1 } }
        //                 )
        //                 return res.send('Success');
        //             } else if (newOrder < originalOrder) {
        //                 await Offer.updateMany(
        //                     {
        //                         order: { $gte: newOrder, $lt: originalOrder },
        //                         _id: { $ne: offer._id },
        //                     },
        //                     { $inc: { order: 1 } }
        //                 )
        //                 return res.send('Success');
        //             }
        //         }
        //     } catch (error: any) {
        //         console.error('Error saving offer:', error);
        //         res.status(500).json({ message: error.message || 'Server error' });
        //     }
        // }


        if (req.method === 'POST') {
            try {
                const { id, order } = req.body;

                if (!id || order === undefined) {
                    return res.status(400).json({ message: 'User ID and new order are required' });
                }

                const user = await User.findById(id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const originalOrder = user.order;
                const newOrder = parseInt(order);

                if (originalOrder === newOrder) {
                    return res.status(200).json({ message: 'Order unchanged' });
                }

                // Update current user's order
                user.order = newOrder;
                await user.save();

                // Shift other users
                if (newOrder > originalOrder) {
                    await User.updateMany(
                        {
                            order: { $gt: originalOrder, $lte: newOrder },
                            _id: { $ne: user._id },
                        },
                        { $inc: { order: -1 } }
                    );
                } else {
                    await User.updateMany(
                        {
                            order: { $gte: newOrder, $lt: originalOrder },
                            _id: { $ne: user._id },
                        },
                        { $inc: { order: 1 } }
                    );
                }

                return res.status(200).json({ message: 'Reorder successful' });
            } catch (error: any) {
                console.error('Reorder Error:', error);
                return res.status(500).json({ message: error.message || 'Server Error' });
            }
        }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})




