import cron from 'node-cron';

const apiBaseUrl = process.env.API_BASE_URL ?? `https://core.shkh1601.workers.dev`;

cron.schedule('*/5 * * * *', async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/common/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'senghonghang@gmail.com',
                subject: 'Cron Job Test',
                html: 'This is a test email sent every 5 minutes by the cron job.',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Email API failed with ${response.status}: ${errorText}`);
        }

        console.log('Cron email sent successfully');
    } catch (error) {
        console.error('Cron email failed:', error);
    }
});
