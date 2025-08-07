import type { NextApiRequest, NextApiResponse } from 'next';
import { Footer } from '@/models/footer';
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';
import { authorize } from '@/middleware/authorize';


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
        // await new Promise((resolve, reject) =>
        //     authorize(req, res, (result: unknown) => {
        //         if (result instanceof Error) return reject(result);
        //         return resolve(result);
        //     })
        // );
        // --- Route Logic ---
        if (req.method === 'GET') {
            try {
                const footers = await Footer.find().populate('followUs').populate('pageLinks').populate('accordians').populate('otherText');
                console.log(footers);
                res.send(footers);
            } catch (err: any) {
                res.status(500).send({ error: err.message });
            }
        }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})

