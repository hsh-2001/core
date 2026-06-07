import commonService from "./common.service";
import type { Context } from "hono";
import type { AppEnv } from "../../shared/types";
import { sendError, sendSuccess, sendValidationError } from "../../shared/response";

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
            return sendValidationError(c, "`subject` field is required");
        }

        if (isBlank(to)) {
            return sendValidationError(c, "`to` field is required");
        }

        if (isBlank(html)) {
            return sendValidationError(c, "`html` field is required");
        }

        const response = await commonService.senderEmail({
            to: to as string,
            subject: subject as string,
            html: html as string,
            env: c.env,
        });

        return sendSuccess(c, response, { message: "Email sent successfully" });
    } catch (error) {
        return sendError(c, error, 500, "Error sending email");
    }
};

const autoMeetingScheduler = async (c: Context<AppEnv>) => {
    try {
        const response = await commonService.autoMeetingScheduler();
        return sendSuccess(c, response, { message: "Auto meeting scheduler executed successfully" });
    } catch (error) {
        console.error("Error in autoMeetingScheduler:", error);
        return sendError(c, error, 500, "Error executing auto meeting scheduler");
    }
}

export default {
    sendEmail,
    autoMeetingScheduler,
};
