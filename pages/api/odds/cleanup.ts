// pages/api/odds/cleanup.ts
import { NextApiRequest, NextApiResponse } from 'next'

import { connectDb } from '@/lib/startup/connectDb';
import { deleteOutdatedOdds } from '@/lib/jobs/deleteOutdatedOdds';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  await deleteOutdatedOdds();
  res.status(200).json({ message: 'Old odds deleted' });
}
