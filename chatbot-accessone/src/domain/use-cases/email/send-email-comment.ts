import { EmailService } from "../../../presentation/services";

interface SendCommentEmailUseCase {
    execute: (
        to: string | string[],
        cc: string | string[],
        subject: string,
        htmlBody: string
    ) => Promise<boolean>;
}

export class SendEmailComment implements SendCommentEmailUseCase {
    constructor(private readonly emailService: EmailService) {}
    async execute(to: string | string[], cc: string | string[], subject: string, htmlBody: string) {
        try {
            const sent = await this.emailService.sendEmail({
                to,
                cc,
                subject,
                htmlBody,
            });
            if (!sent) {
                throw new Error("Email log not sent");
            }

            return true;
        } catch (error) {
            // const log = new LogEntity({
            //     level: LogSeverityLevel.high,
            //     message: `Error ${error}`,
            //     origin: "send-email-logs.ts",
            // });
            // this.logRepository.saveLog(log);
            return false;
        }
    }
}
