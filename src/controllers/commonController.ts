import commonService from "../services/commonService";
import type { Context } from "hono";
import type { AppEnv } from "../types";

type SendEmailBody = {
    to?: string;
    subject?: string;
    html?: string;
};

const isBlank = (value: unknown) => typeof value !== "string" || value.trim() === "";

const sendEmail = async (c: Context<AppEnv>) => {
    try {
        const { to, subject, html } = await c.req.json<SendEmailBody>();

        if (isBlank(subject)) {
            return c.json({ success: false, message: "`subject` field is required" }, 400);
        }

        if (isBlank(to)) {
            return c.json({ success: false, message: "`to` field is required" }, 400);
        }

        if (isBlank(html)) {
            return c.json({ success: false, message: "`html` field is required" }, 400);
        }

        const response = await commonService.senderEmail(to, subject, html);

        return c.json({ success: true, message: "Email sent successfully", data: response });
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return c.json({ success: false, message: "Error sending email", error: message }, 500);
    }
};

export default {
    sendEmail,
};
