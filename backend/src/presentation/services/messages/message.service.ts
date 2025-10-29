import nodemailer, { SendMailOptions } from "nodemailer";
import axios from "axios";
import { envs } from "../../../config";

export interface SendMessageOptions {
    to: string | string[];
    message: string;
    // attachments?: Attachment[];
}

// export interface Attachment {
//     filename: string;
//     path: string;
// }

export class MessageService {
    private url = `http://localhost:${envs.PORT_BOT}/v1/messages`;

    constructor() {}

    async sendMessage(options: SendMessageOptions): Promise<boolean> {
        const { to,  message } = options;

        try {
            
            await axios.post(this.url, { to, message });

            return true; 
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}



