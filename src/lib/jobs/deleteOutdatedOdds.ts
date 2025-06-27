 

import cron from 'node-cron';
import { Odd } from '../../models/odd';

/**
 * Schedules a cron job to delete outdated odds every minute.
 */
export const deleteOutdatedOdds = async () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Step 1: Fetch outdated odds
      const outdatedOdds = await Odd.find({
        eventDateTime: { $lt: now },
      });

      if (outdatedOdds.length === 0) return;

      // Step 2: Get IDs and minimum order
      const idsToDelete = outdatedOdds.map(odd => odd._id);
      const minOrder = Math.min(...outdatedOdds.map((odd:any) => odd.order));

      // Step 3: Delete all outdated odds
      await Odd.deleteMany({ _id: { $in: idsToDelete } });

      // Step 4: Decrement order of remaining items
      await Odd.updateMany(
        { order: { $gt: minOrder } },
        { $inc: { order: -outdatedOdds.length } }
      );

      console.log(
        `[CRON] Deleted ${outdatedOdds.length} outdated odds at ${now.toISOString()}`
      );
    } catch (err) {
      console.error('[CRON] Error processing outdated odds:', err);
    }
  });
};

