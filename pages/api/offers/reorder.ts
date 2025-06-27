import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { saveImage, validateOrder, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
import { Offer, validateFileInput, validateOffer } from '@/models/offer';


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
        if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
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
        if (req.method === 'POST') {
            try {
                const { error } = validateOrder(req.body);
                if (error) return res.status(400).send(error.details[0].message);

                const offer = await Offer.findById(req.body.id);
                if (!offer)
                    return res.status(404).send('The offer with the given ID does not exist.');
                const originalOrder = offer.order;
                const newOrder = parseInt(req.body.order);
                if (originalOrder === undefined) {
                    return res.status(400).send('Original order is missing for this odd.');
                }
                if (originalOrder !== newOrder) {
                    offer.order = newOrder;
                   await offer.save()
                     if (newOrder > originalOrder) {
                            await Offer.updateMany(
                                {
                                    order: { $gt: originalOrder, $lte: newOrder },
                                    _id: { $ne: offer._id },
                                },
                                { $inc: { order: -1 } }
                            )
                             return res.send('Success');
                        } else if (newOrder < originalOrder) {
                            await Offer.updateMany(
                                {
                                    order: { $gte: newOrder, $lt: originalOrder },
                                    _id: { $ne: offer._id },
                                },
                                { $inc: { order: 1 } }
                            )
                             return res.send('Success');
                        }
                }
            } catch (error: any) {
                console.error('Error saving offer:', error);
                res.status(500).json({ message: error.message || 'Server error' });
            }
        }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})


 

