import { BLOG_ENDPOINT } from '@/lib/constants';

import type { NextApiRequest, NextApiResponse } from 'next';


import { withCors } from '@/middleware/cors';
import Parser from 'rss-parser';
import { connectDb } from '@/lib/startup/connectDb';

// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDb();
    // --- Route Logic ---
    if (req.method === 'GET') {
      const parser = new Parser();

      try {
        if (!BLOG_ENDPOINT) {
          return res.status(200).json({ message: 'BLOG_ENDPOINT is not defined' });
        }
        const parsedRss = await parser.parseURL(BLOG_ENDPOINT!);
        parsedRss?.items?.forEach((item) => {
          const content = item?.['content:encoded'];
          const thumbnail = content?.match(/<img.*?src="(.*?)"/)?.[1];
          item.thumbnail = thumbnail;
        });
  
        return res.status(200).json({ message: 'OK', parsedRss });

      } catch (error: any) {
        console.log('ERROR: ', error);
        return res.status(500).json({ message: 'Error', error });
      }
    }
    return res.status(405).json({ error: `Method '${req.method}' not allowed` });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
})




