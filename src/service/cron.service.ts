import cron from 'node-cron';
import { Op } from 'sequelize';
import { Referral, Order } from '../models';

export const initCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled job to clear pending referrals...');
    try {
      // Find all pending referrals
      const pendingReferrals = await Referral.findAll({
        where: {
          status: 'pending'
        },
        include: [{
          model: Order,
          required: true
        }]
      });

      const returnWindowDays = 7;
      const now = new Date();

      for (const referral of pendingReferrals) {
        if (referral.order && referral.order.status === 'delivered') {
          const deliveredDate = referral.order.updated_at; // assuming order updated_at is roughly when it was delivered
          
          if (deliveredDate) {
            const diffTime = Math.abs(now.getTime() - deliveredDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays >= returnWindowDays) {
              referral.status = 'cleared';
              await referral.save();
              console.log(`Referral ${referral.id} cleared.`);
            }
          }
        }
      }
      
      console.log('Scheduled job finished.');
    } catch (error) {
      console.error('Error running scheduled job:', error);
    }
  });
};
