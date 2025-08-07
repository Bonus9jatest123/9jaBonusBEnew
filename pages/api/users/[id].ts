import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { deleteImage, saveImage, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
import { Offer, validateFileInput, validateOffer } from '@/models/offer';
import { Odd } from '@/models/odd';
import { User } from '@/models/user';

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
 
        // --- Route Logic ---

        if (req.method == 'GET') {
            try {
                const userId = req.query.id as string;
                if (!userId) {
                    return res.status(404).json({ message: 'User Id not found' });
                }
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                if(user.permission && user.permission.length==0) {
                    return res.status(404).json({ message: 'User has no permissions Please assign some permission first' });
                }
                user.status = user.status === 0 ? 1 : 0; // Toggle status
                await user.save();
                const users = await User.find({role: 2})
                    .sort('name')

                return res.status(200).json(users);
            } catch (error: any) {
                res.status(500).json({ message: error.message || 'Internal server error' });
            }
        }
         if (req.method == 'POST') {
            try {
                const userId = req.query.id as string;
                const permissions = req.body.permissions as string[];
                if(!permissions) {
                    return res.status(400).json({ message: 'Permissions are required' });}
                if (!userId) {
                    return res.status(404).json({ message: 'User Id not found' });
                }
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
               user.permission = permissions; // Assign permissions
                await user.save();
                const users = await User.find({role: 2})
                    .sort('name')

                return res.status(200).json(users);
            } catch (error: any) {
                res.status(500).json({ message: error.message || 'Internal server error' });
            }
        }
          if (req.method === 'DELETE') {
                    try {
                        const { id } = req.query;
                        if (!id) {
                            return res.status(404).send('User Id is required');
                        }
                        const user = await User.findById(id);
                        if (!user) {
                            return res.status(404).send('The user with the given ID does not exist.');
                        }
                        await User.deleteOne({ _id: user._id });
                        await User.updateMany(
                            { order: { $gt: user.order } },
                            { $inc: { order: -1 } }
                        );
        
                        return res.status(200).send(user);
                    }
                    catch (err: any) {
                        console.error('API Error:', err);
                        return res.status(500).json({ error: 'Internal server error', details: err.message });
                    }
                }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})


 

