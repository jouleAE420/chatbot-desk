import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
import { TicketType } from "../../../../domain/entities/tickets/ticket.entity";
import { commentFlow, flowToCity, selectParkingsFlow } from "../flows";
import { NumberEmoji } from "../../../../config/strings/emojis.number";
import { strings } from "../../../../config/strings";
import { CityEntity, ParkingEntity } from "../../../../domain/entities";

const welcomeString =
    `${strings.es.whatsappBot.welcome}\n` +
    `${NumberEmoji[1]} ${strings.es.whatsappBot.complaint}\n` +
    `${NumberEmoji[2]} ${strings.es.whatsappBot.suggestion}\n` +
    // `${NumberEmoji[3]} ${strings.es.whatsappBot.quotation}\n` +
    strings.es.whatsappBot.chooseNumber;

export const welcomeFlow = addKeyword<Provider, Database>([EVENTS.WELCOME]).addAnswer(
    welcomeString,
    { capture: true, delay: 800 },
    async (ctx, { fallBack, gotoFlow, state }) => {
        const answer = parseInt(ctx.body);

        if (!answer || answer > 2 || answer == 0) {
            return fallBack(strings.es.whatsappBot.chooseValidOption);
        }

        switch (answer) {
            case 1:
                await state.update({ type: TicketType.complaint });
                break;
            case 2:
                await state.update({ type: TicketType.suggestion });
                break;
            default:
                await state.update({ type: TicketType.other });
                return gotoFlow(welcomeFlow);
        }
        const city: CityEntity = state.get("selectedCity");
        const parking: ParkingEntity = state.get("selectedParking");
        if (city && parking) return gotoFlow(commentFlow);
        return gotoFlow(flowToCity);
    }
);
