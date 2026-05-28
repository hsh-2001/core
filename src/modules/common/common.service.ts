import { Resend } from 'resend';
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
    const apiKey = env?.RESEND_API_KEY ?? nodeEnv?.RESEND_API_KEY;
    const from = env?.EMAIL_FROM ?? nodeEnv?.EMAIL_FROM;

    if (!apiKey) {
        throw new Error('RESEND_API_KEY is not set');
    }

    if (!from) {
        throw new Error('EMAIL_FROM is not set');
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export default {
    senderEmail
};
