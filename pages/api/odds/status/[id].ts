import type { NextApiRequest, NextApiResponse } from 'next';
import { Footer, validateStatusUpdate } from '@/models/footer';
import { connectDb } from '@/lib/startup/connectDb';
import { withCors } from '@/middleware/cors';
import { authorize } from '@/middleware/authorize';
import mongoose from 'mongoose';
import { Odd } from '@/models/odd';
import { findBestOdds } from '@/lib/backend.utils';

// Disable Next.js default body parser (for multer)

// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {


    try {
        await connectDb();

        // Middleware: JWT Authorization (for POST and PUT)
        // await new Promise((resolve, reject) =>
        //     authorize(req, res, (result: unknown) => {
        //         if (result instanceof Error) return reject(result);
        //         return resolve(result);
        //     })
        // );


        if (req.method == 'PUT') {
            // const { error } = validateStatusUpdate(req.body);
            // if (error) return res.status(400).send({ error: error.details[0].message });
            try {
                await connectDb();
                const { id } = req.query;
                const { status, suspendItem } = req.body;
                if (!status) {
                    return res.status(400).send('Status is required');
                }
                if (!suspendItem) {
                    return res.status(400).send('Suspend item is required');
                }

                const OddsId = Array.isArray(id) ? id[0] : id;

                if (!OddsId) {
                    return res.status(404).send('Odds Id is required');
                }

                if (!OddsId || !mongoose.Types.ObjectId.isValid(OddsId)) {
                    return res.status(400).json({ error: 'Invalid Odds Id format' });
                }

                const Odds = await Odd.findById(OddsId);
                if (!Odds) return res.status(404).send('Odd not found');
                const isActive = status === 'active';

                if (suspendItem === 'suspendAll') {
                    Odds.suspendAll = isActive;
                    Odds.odds.forEach((bookieOdds) => {
                        bookieOdds.suspended = isActive;
                    });
                } else {
                    // suspend specific bookie like "22Bet"
                    const bookieOdds = Odds.odds.get(suspendItem);
                    console.log(bookieOdds, 'bookieOdds');
                    if (!bookieOdds) {
                        return res.status(404).send(`Bookie '${suspendItem}' not found in odds`);
                    }

                    bookieOdds.suspended = isActive;
                    Odds.odds.set(suspendItem, bookieOdds); // ✅ update map

                    Odds.suspendAll = Array.from(Odds.odds.values()).every(
                        (bookieOdds) => bookieOdds.suspended)
                }
                const formattedOdds: Record<string, { oneX: any; suspended: boolean }> = {};
                if (Odds?.odds instanceof Map) {
    Odds.odds.forEach((data, bookie) => {
        const bookieData = data as { oneX: any; suspended: boolean };
        formattedOdds[bookie] = {
            oneX: bookieData.oneX,
            suspended: bookieData.suspended
        };
    });
} else {
    for (const [bookie, data] of Object.entries(Odds?.odds || {})) {
        const bookieData = data as { oneX: any; suspended: boolean };
        formattedOdds[bookie] = {
            oneX: bookieData.oneX,
            suspended: bookieData.suspended
        };
    }
}
                const bestCalculatedOdds = findBestOdds(formattedOdds);
                if ('error' in bestCalculatedOdds) {
                    return res.status(400).json({ status: false, message: bestCalculatedOdds.error });
                }
                Odds.bestCalculatedOdds = bestCalculatedOdds;
                Odds.markModified('odds'); // Mark the odds field as modified
                await Odds.save();
                return res.status(200).json({ status: true, message: 'Suspension updated', Odds });
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

