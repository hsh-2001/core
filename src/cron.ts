import cron from 'node-cron';
import commonService from './modules/common/common.service';

cron.schedule('*/5 * * * *', async () => {
    await commonService.senderEmail('senghonghang@gmail.com', 'Cron Job Test', 'This is a test email sent every 5 minutes by the cron job.');
});