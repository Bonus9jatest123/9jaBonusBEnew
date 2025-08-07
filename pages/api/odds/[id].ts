import type { NextApiRequest, NextApiResponse } from 'next';
import { Odd, validateOdd } from '@/models/odd';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { findBestOdds } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';



// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        await connectDb();

        // Middleware: JWT Authorization (for POST and PUT)
        if (req.method === 'POST' || req.method === 'PUT') {
            await new Promise((resolve, reject) =>
                authorize(req, res, (result: unknown) => {
                    if (result instanceof Error) return reject(result);
                    return resolve(result);
                })
            );
        }

        // --- Route Logic ---

        if (req.method === 'PUT') {
            try {
                const { error } = validateOdd({ isEdit: true, ...req.body });
                const { id } = req.query;
                if (!id) {
                    return res.status(404).json({ status: false, message: 'Odd Id is required' });
                }

                if (error) return res.status(400).json({ status: false, message: error.details[0].message });
                const odd = await Odd.findById(id);
                if (!odd)
                    return res.status(404).send('The odd with the given ID does not exist.');
                let oddData = extractOdd(req);
                console.log('Odd data before update:', oddData?.odds);
                const bestCalculatedOdds = findBestOdds(oddData?.odds);

                if ('error' in bestCalculatedOdds) {
                    return res.status(400).json({ status: false, message: bestCalculatedOdds.error });
                }
                oddData = { ...oddData, bestCalculatedOdds } as any;
                if (Object.values(oddData.odds).every((bookie:any) => bookie.suspended)) {
                    oddData.suspendAll = true;
                    
                }
                else if (oddData.suspendAll == true) {
                    for (const [bookie, data] of Object.entries(oddData.odds)) {
                        const bookieData = data as { suspended: boolean }; // 👈 add this line
                        bookieData.suspended = true;
                        oddData.odds[bookie] = bookieData;
                    }
                    
                }
                 
                const updatedOdd = await Odd.findByIdAndUpdate(odd._id, oddData, {
                    new: true,
                });
                return res.status(200).json({ status: true, updatedOdd });

            } catch (err: any) {
                console.log(err)
                return res.status(500).json({ status: false, message: err.message });
            }
        }
        if (req.method === 'DELETE') {
            try {
                const { id } = req.query;
                if (!id) {
                    return res.status(404).send('Odd Id is required');
                }
                const odd = await Odd.findById(id);
                if (!odd) {
                    return res.status(404).send('The odd with the given ID does not exist.');
                }
                await Odd.deleteOne({ _id: odd._id });
                await Odd.updateMany(
                    { order: { $gt: odd.order } },
                    { $inc: { order: -1 } }
                );

                return res.status(200).send(odd);
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

function extractOdd(req: any) {
    return {
        eventDateTime: req.body.eventDateTime,
        league: req.body.league,
        homeTeam: req.body.homeTeam,
        awayTeam: req.body.awayTeam,
        suspendAll: req.body.suspendAll,
        odds: req.body.odds,
    };
}

