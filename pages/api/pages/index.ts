import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { saveImage, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
import { User } from '@/models/user';
import { Page } from '@/models/pages';


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
        if (req.method === 'POST' || req.method === 'PUT' ) {
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
                const pages = await Page.find()
                    .sort('name')
                return res.send({
                    pages,
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


 






