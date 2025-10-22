import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";

import { EmailService } from "../../../../presentation/services/email/email.service";
import { MessageService } from "../../../../presentation/services/messages/message.service";
import { emailTicketHTML, envs, strings } from "../../../../config";
import { CityEntity, ParkingEntity } from "../../../../domain/entities";
import { SendMessageComment, SendEmailComment } from "../../../../domain/use-cases";
import { TicketService } from "../../tickets/tickets.service";
import { TicketRepository } from "../../../../domain/repository/tickets/ticket.repository";
import { TicketRepositoryImpl } from "../../../../infrastructure/repositories";
import { TicketParkingDatasourceMongo } from "../../../../infrastructure/datasources";

const emailService = new EmailService();
const messageService = new MessageService();
const ticketDatasource = new TicketParkingDatasourceMongo();
const ticketRepository = new TicketRepositoryImpl(ticketDatasource);
const ticketService = new TicketService(ticketRepository);

export const commentFlow = addKeyword<Provider, Database>(EVENTS.ACTION).addAnswer(
    strings.es.whatsappBot.makeComment,
    { capture: true },
    async (ctx, { state, flowDynamic, endFlow, globalState }) => {
        //await flowDynamic(strings.es.whatsappBot.messageDelivered);
        //TODO: SAVE COMMENT




        //SEND EMAIL
        const parking: ParkingEntity = state.get("selectedParking");
        const type: string = state.get("type");
        const city: CityEntity = state.get("selectedCity");

        const title = `${type.toUpperCase()} ${parking.name}, ${city.name}, ${city.state}`;

        new SendEmailComment(emailService).execute(
            envs.ADMON_MAIL,
            envs.ADMON_MAIL,
            title,
            emailTicketHTML(ctx.from, title, ctx.body)
        );

        new SendMessageComment(messageService).execute(envs.ADMON_PHONE, title, ctx.body, ctx.from);
        
        const ticket = await ticketService.createTicket({
            type,
            parkingId: parking.id,
            phoneOrigin: ctx.from,
            comment: ctx.body,
            clientName: ctx.name || "N/A",
            status: "CREATED",
            rate:5}
        );
        // const ticket= await saveTicket(type, parking.id, city.id, ctx.from, ctx.body);

        // await flowDynamic(`✅ ${strings.es.whatsappBot.commentSaved} \n${strings.es.whatsappBot.ticketNumber} #${ticket.ticketNumber}`);

        state.clear();
        globalState.clear();
        return endFlow(strings.es.whatsappBot.messageDelivered);
    }
);
