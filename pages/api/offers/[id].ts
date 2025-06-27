import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { deleteImage, saveImage, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
import { Offer, validateFileInput, validateOffer } from '@/models/offer';
import { Odd } from '@/models/odd';




// Disable Next.js default body parser (for multer)
export const config = {
    api: {
        bodyParser: false,
    },
};

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
        if (req.method === 'POST' || req.method === 'PUT') {
            try {
                await runMiddleware(req, res, upload.fields([{ name: 'logo' }, { name: 'infoImage' }]));
            } catch (error: any) {
                return res.status(405).json({ message: error.message });
            }

        }

        // --- Route Logic ---
        if (req.method === 'GET') {
            try {
                const offerId = (req.query.id as string) || '';
                if (!offerId) {
                    return res.status(404).json({ message: 'Offer Id not found' });
                }
                const offer = await Offer.findById(offerId);

                if (!offer)
                    return res.status(404).send('The offer with the given ID does not exist.');

                res.send(offer);
            }
            catch (err: any) {
                console.error('Error saving offer:', err);
                res.status(500).json({ message: err.message || 'Server error' });
            }
        }

        if (req.method === 'PUT') {
            try {
                const offerId = (req.query.id as string) || '';
                if (!offerId) {
                    return res.status(404).json({ message: 'Offer Id not found' });
                }
                // Validate
                const { error } = validateOffer({ isEdit: true, ...req.body });
                if (error) return res.status(400).json({ message: error.details[0].message });
                const offer = await Offer.findById(offerId);
                if (!offer) return res.status(404).json({ message: 'Offer not found' });
                // Handle images
                let images: any = {};
                const files = (req as any).files as Record<string, Express.Multer.File[]>;
                if (files) {
                    const { error: fileError } = validateFileInput(files);
                    if (fileError) return res.status(400).json({ message: fileError.details[0].message });

                    for (const file in files) {
                        const imgFile = files[file]?.[0];
                        const isLogo = file === 'logo';
                        if (imgFile) {
                            const imageData = await saveImage(imgFile, (offer as any)[file]?.cloudinaryId, isLogo);
                            if (imageData?.error) {
                                return res.status(500).json({ message: 'Image processing failed' });
                            }
                            images[file] = imageData;
                        }
                    }
                }
                // Extract data and update
                const offerData = extractOffer(req);
                if (images?.logo) offerData.logo = images.logo;
                if (images?.infoImage) offerData.infoImage = images.infoImage;

                const updatedOffer = await Offer.findByIdAndUpdate(offer._id, offerData, {
                    new: true,
                });
                return res.status(200).json(updatedOffer);
            } catch (error: any) {
                console.error('Error saving offer:', error);
                res.status(500).json({ message: error.message || 'Server error' });
            }
        } if (req.method == 'DELETE') {
            try {
                const offerId = req.query.id as string;
                if (!offerId) {
                    return res.status(404).json({ message: 'Offer Id not found' });
                }
                const offer = await Offer.findById(offerId);

                if (!offer) {
                    return res.status(404).json({ message: 'Offer not found' });
                }
                const bookieName = offer.name;
                const oddsToUpdate = await Odd.find({ [`odds.${bookieName}`]: { $exists: true } });

                const updatePromises = oddsToUpdate.map((odd) => {
                    odd.odds.delete(bookieName);
                    return odd.save();
                });

                await Promise.all(updatePromises);
                if (offer.logo?.cloudinaryId) await deleteImage(offer.logo.cloudinaryId);
                if (offer.infoImage?.cloudinaryId) await deleteImage(offer.infoImage.cloudinaryId);
                await Offer.deleteOne({ _id: offer._id });
                await Offer.updateMany(
                    { order: { $gt: offer.order } },
                    { $inc: { order: -1 } }
                );

               return res.status(200).json(offer);
            } catch (error: any) {
                console.error('Error in DELETE /api/offer/[id]:', error);
                res.status(500).json({ message: error.message || 'Internal server error' });
            }
        }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})


function extractOffer(req: any) {
    return {
        name: req.body.name,
        playLink: req.body.playLink,
        enabled: req.body.enabled,
        promoInfo: req.body.promoInfo,
        rating: req.body.rating,
        review: req.body.review,
        upTo: req.body.upTo,
        wageringRollover: req.body.wageringRollover,
        minOdds: req.body.minOdds,
        keyInfo2: req.body.keyInfo2,
        keyInfo3: req.body.keyInfo3,
        terms: req.body.terms,
        pros: req.body.pros,
        cons: req.body.cons,
        minOddsForBonus: req.body.minOddsForBonus,
        selections: req.body.selections && JSON.parse(req.body.selections),
        logo: undefined,        // Add this line
        infoImage: undefined,
    };
}

