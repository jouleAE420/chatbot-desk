import { MessageService } from "../../../presentation/services";
import { strings } from "../../../config/strings";
import { shortenWhatsappLink } from "../url/shorten-url";

interface SendCommentMessageUseCase {
    execute: (
        to: string | string[],
        from: string,
        subject: string,
        messageBody: string
    ) => Promise<boolean>;
}

export class SendMessageComment implements SendCommentMessageUseCase {
    constructor(private readonly messageService: MessageService) {}

    async execute(to: string | string[], subject: string, messageBody: string, from: string) {
        const {attendThis,urlEncodedAgentPresentation}=strings.es.whatsappBot
        try {
            const whatsappLink = `https://wa.me/${from}?text=${urlEncodedAgentPresentation}`;
            const shortWhatsappLink=await shortenWhatsappLink(whatsappLink)
            const message = `${subject}\n"${messageBody}"\n\n${attendThis}\n${shortWhatsappLink}`;
            const sent = await this.messageService.sendMessage({
                to,
                message,
            });
            
            if (!sent) {
                throw new Error("Message not sent");
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
