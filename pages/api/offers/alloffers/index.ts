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
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'GET') {
            await new Promise((resolve, reject) =>
                authorize(req, res, (result: unknown) => {
                    if (result instanceof Error) return reject(result);
                    return resolve(result);
                })
            );
        }


       

        // --- Route Logic ---
        if (req.method === 'GET') {
            try {
              
                const options = req.query.disabled ? {} : { enabled: true };

                const offers = await Offer.find(options)
                    .sort('order')

                return res.status(200).json({
                    status: true, offers,
                
                });
            }
            catch (err: any) {
              console.error('Error updating footer:', err);
                return res.status(500).json({ status: false, message: err.errors?.name?.message });
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






