import type { NextApiRequest, NextApiResponse } from 'next';
import { Odd, validateOdd } from '@/models/odd';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { findBestOdds, validatePagination } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';



// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDb();


        // Middleware: JWT Authorization (for POST and PUT)
      
        // --- Route Logic ---
        if (req.method === 'GET') {
            try {
                const { error } = validatePagination(req.query);

                if (error) return res.status(400).send(error.details[0].message);
                const pageNumber = Array.isArray(req.query.pageNumber) ? req.query.pageNumber[0] : req.query.pageNumber;
                const pageSize = Array.isArray(req.query.pageSize) ? req.query.pageSize[0] : req.query.pageSize;

                const currentPage = parseInt(pageNumber || '1', 10);
                const limit = parseInt(pageSize || '10', 10);
                const options = req.query.disabled ? {} : { suspendAll: false };
                const odds = await Odd.find(options)
                    .sort('order')
                    .limit(limit)
                    .skip((currentPage - 1) * limit);
                const totalOdds = await Odd.countDocuments();
                const totalPages = Math.ceil(totalOdds / limit);

                return res.send({
                    odds,
                    currentPage,
                    totalPages,
                    totalOdds,
                });
            }
            catch (err: any) {
                console.log(err)
                return res.status(500).json({ error: err.message });
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

