

import type { NextApiRequest, NextApiResponse } from 'next';
import { Odd } from '@/models/odd';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { validateOrder } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';
 
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDb();
 
        // Middleware: JWT Authorization (for POST and PUT)
        if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
            const authResult = await new Promise((resolve, reject) =>
                authorize(req, res, (result: unknown) => {
                    if (result instanceof Error) return reject(result);
                    return resolve(result);
                })
            );
        }
 
        if (req.method === 'POST') {
            try {
                const { error } = validateOrder(req.body);
                if (error) return res.status(400).send(error.details[0].message);
 
const odd = await Odd.findById(req.body.id);
 
                if (!odd)
                    return res.status(404).send('The odd with the given ID does not exist.');
 
                const originalOrder = odd.order;
                const newOrder = parseInt(req.body.order);
                if (originalOrder === undefined) {
                    return res.status(400).send('Original order is missing for this odd.');
                }
                if (originalOrder !== newOrder) {
                    odd.order = newOrder;
await odd.save(); // Await here
 
                    if (newOrder > originalOrder) {
                        await Odd.updateMany(
                            {
                                order: { $gt: originalOrder, $lte: newOrder },
                                _id: { $ne: odd._id },
                            },
                            { $inc: { order: -1 } }
                        );
                        return res.send('Success');
                    } else if (newOrder < originalOrder) {
                        await Odd.updateMany(
                            {
                                order: { $gte: newOrder, $lt: originalOrder },
                                _id: { $ne: odd._id },
                            },
                            { $inc: { order: 1 } }
                        );
                        return res.send('Success');
                    }
                }
                // If no order change, still respond
                return res.send('No change');
            } catch (err: any) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
        }
 
        // Only reached if method is not POST
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
 

