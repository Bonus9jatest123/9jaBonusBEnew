import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { saveImage, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
import { Offer, validateFileInput, validateOffer } from '@/models/offer';
import { User } from '@/models/user';


// Disable Next.js default body parser (for multer)
export const config = {
    api: {
        bodyParser: false,
    },
};

 

// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDb();

        // Middleware: JWT Authorization (for POST and PUT)
        // if (req.method === 'POST' || req.method === 'PUT') {
            await new Promise((resolve, reject) =>
                authorize(req, res, (result: unknown) => {
                    if (result instanceof Error) return reject(result);
                    return resolve(result);
                })
            );
        // }
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

                const users = await User.find({role: 2})
                    .sort('name')
                    .limit(limit)
                    .skip((page - 1) * limit);

                const totalUsers = await User.countDocuments({role: 2});
                const totalPages = Math.ceil(totalUsers / limit);

                return res.send({
                    users,
                    currentPage: page,
                    totalPages,
                    totalUsers,
                });
            }
            catch (err: any) {

            }
        }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})


 






