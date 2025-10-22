import nodemailer, { SendMailOptions } from "nodemailer";
import { envs } from "../../../config";

export interface SendEmailOptions {
    to: string | string[];
    cc?: string | string[];

    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

export interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY,
        },
    });
  
    constructor() {}

    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        const { to, cc, subject, htmlBody, attachments = [] } = options;

        try {
            await this.transporter.sendMail({
                to: to,
                cc: cc,
                subject: subject,
                html: htmlBody,
                attachments: attachments,
            });

            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}
