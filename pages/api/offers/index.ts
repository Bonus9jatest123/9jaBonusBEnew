import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { saveImage, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
import { Offer, validateFileInput, validateOffer } from '@/models/offer';


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
        if (req.method === 'POST') {
            try {
                 await runMiddleware(req, res, upload.fields([{ name: 'logo' }, { name: 'infoImage' }]));
             } catch (error: any) {
              return res.status(405).json({ message: error.message });
            }
        }

        // --- Route Logic ---
        if (req.method === 'GET') {
            try {
                const { error } = validatePagination(req.query);
                const pageNumberRaw = Array.isArray(req.query.pageNumber) ? req.query.pageNumber[0] : req.query.pageNumber;
                const pageSizeRaw = Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize;

                if (error) return res.status(400).send(error.details[0].message);

                const page = parseInt(pageNumberRaw || '1', 10);
                const limit = parseInt(pageSizeRaw || '10', 10);

                const options = req.query.disabled ? {} : { enabled: true };

                const offers = await Offer.find(options)
                    .sort('order')
                    .limit(limit)
                    .skip((page - 1) * limit);

                const totalOffers = await Offer.countDocuments();
                const totalPages = Math.ceil(totalOffers / limit);

               return res.send({
                    offers,
                    currentPage: page,
                    totalPages,
                    totalOffers,
                });
            }
            catch (err: any) {

            }
        }

        if (req.method === 'POST') {
            try {
                // Run multer upload middleware
                 const { error } = validateOffer(req.body);
                if (error) return res.status(400).json({ message: error.details[0].message });

                let images: Record<string, any> = {};

                const files = (req as any).files || {};
                const fileValidation = validateFileInput(files);
                if (fileValidation?.error) {
                    return res.status(400).json({ message: fileValidation.error.details[0].message });
                }

                for (const fileKey in files) {
                    const imgFile = files[fileKey]?.[0];
                    const isLogo = fileKey === 'logo';

                    if (imgFile) {
                        const imageData = await saveImage(imgFile, null, isLogo);
                        if (imageData?.error) {
                            return res.status(500).json({ message: 'Image upload failed' });
                        }
                        images[fileKey] = imageData;
                    }
                }

                // Extract offer data from request
                const offerData = extractOffer(req as any);

                if (images.logo) offerData.logo = images.logo;
                if (images.infoImage) offerData.infoImage = images.infoImage;

                const offer = new Offer(offerData);
                await offer.save();

              return  res.status(201).json(offer);
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






