import type { NextApiRequest, NextApiResponse } from 'next';
import { Footer, validateStatusUpdate } from '@/models/footer';
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';
import { authorize } from '@/middleware/authorize';
import mongoose from 'mongoose';

// Disable Next.js default body parser (for multer)

// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    

    try {
        await connectDb();

        // Middleware: JWT Authorization (for POST and PUT)
        await new Promise((resolve, reject) =>
            authorize(req, res, (result: unknown) => {
                if (result instanceof Error) return reject(result);
                return resolve(result);
            })
        );


        if (req.method == 'PUT') {
            const { error } = validateStatusUpdate(req.body);
            if (error) return res.status(400).send({ error: error.details[0].message });
            try {
                await connectDb();
                const { id } = req.query;
              const footerId = Array.isArray(id) ? id[0] : id;

                if (!footerId) {
                    return res.status(404).send('Foter Id is required');
                }
                const { status } = req.body;
                if (!footerId || !mongoose.Types.ObjectId.isValid(footerId)) {
                    return res.status(400).json({ error: 'Invalid footer ID format' });
                }

                const footer = await Footer.findById(footerId);
                if (!footer) return res.status(404).send('Footer not found');
                if (status === 'active') {
                    if (footer.name === 'Set All Footers') {
                        // Set all other footers to inactive
                        await Footer.updateMany({ _id: { $ne: footerId } }, { $set: { status: 'inactive' } });
                    } else {
                        // Make 'Set All Footers' inactive
                        await Footer.updateMany({ name: 'Set All Footers' }, { $set: { status: 'inactive' } });
                    }
                }
                footer.status = status;
                await footer.save();
             return   res.send(footer);
            } catch (err: any) {
              return  res.status(500).send({ error: err.message });
            }
        }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }

})

