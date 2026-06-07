import * as nodemailer from 'nodemailer';
import type { Bindings } from '../../shared/types';

type SendEmailInput = {
    to: string;
    subject: string;
    html: string;
    env?: Partial<Bindings>;
};

const getNodeEnv = () => typeof process === 'undefined' ? undefined : process.env;

const senderEmail = async ({ to, subject, html, env }: SendEmailInput) => {
    const nodeEnv = getNodeEnv();
    const host = env?.SMTP_HOST ?? nodeEnv?.SMTP_HOST;
    const port = Number(env?.SMTP_PORT ?? nodeEnv?.SMTP_PORT ?? 587);
    const user = env?.SMTP_USER ?? nodeEnv?.SMTP_USER;
    const pass = env?.SMTP_PASS ?? nodeEnv?.SMTP_PASS;
    const secureValue = env?.SMTP_SECURE ?? nodeEnv?.SMTP_SECURE;
    const secure = secureValue === undefined ? port === 465 : secureValue === 'true';
    const from = env?.EMAIL_FROM ?? nodeEnv?.EMAIL_FROM;

    if (!host) {
        throw new Error('SMTP_HOST is not set');
    }

    if (Number.isNaN(port)) {
        throw new Error('SMTP_PORT must be a number');
    }

    if (!from) {
        throw new Error('EMAIL_FROM is not set');
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
    });

    const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
    });

    return {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
    };
};

const autoMeetingScheduler = async () => {
    const telegramChatId = "-1004233560362";
    const message = "This is a test message from the auto meeting scheduler.";

    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to send message to Telegram: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export default {
    senderEmail,
    autoMeetingScheduler
};
