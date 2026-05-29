import commonService from './modules/common/common.service';
import type { Bindings } from './shared/types';

export const sendCronEmail = async (env: Bindings, controller?: any) => {
    try {
        await commonService.senderEmail({
            to: 'senghonghang@gmail.com',
            subject: 'Cron Job Test',
            html: 'This is a test email sent every 5 minutes by the cron job.',
            env,
        });
    } catch (error) {
        controller?.noRetry();
        console.error('Cron email failed:', error);
    }
};
