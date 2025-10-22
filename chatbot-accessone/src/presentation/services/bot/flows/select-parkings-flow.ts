import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
import { commentFlow } from "./comment-flow";
import { welcomeFlow } from "./welcome-flow";
import { MongoParkingDatasource } from "../../../../infrastructure/datasources";
import { ParkingRepositoryImpl } from "../../../../infrastructure/repositories";
import { CityEntity, ParkingEntity } from "../../../../domain/entities";
import { NumberEmoji, strings } from "../../../../config";

export const selectParkingsFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
.addAction(async (ctx, { flowDynamic, state }) => {
    const datasource = new MongoParkingDatasource();
    const parkingRepository = new ParkingRepositoryImpl(datasource);
        const city: CityEntity = state.get("selectedCity");
        const parkings = await parkingRepository.getByCity(city.id);
        await state.update({ parkings: parkings });
        const message = makeParkingsString(parkings);
        return await flowDynamic(message);
    })
    .addAction({ capture: true, delay: 800 }, async (ctx, { fallBack, gotoFlow, state }) => {
        const parkings: ParkingEntity[] = state.get("parkings");
        const answer = parseInt(ctx.body);
        if (answer===0)return gotoFlow(welcomeFlow)
        if (!answer || answer > parkings.length) {
            return fallBack(strings.es.whatsappBot.chooseValidOption);
        }
        await state.update({ selectedParking: parkings[answer - 1] });
        return gotoFlow(commentFlow);
    });

const makeParkingsString = (cities: ParkingEntity[]): string => {
   const { chooseParking,backToMainMenu}=strings.es.whatsappBot
    let parkingList = "";
    cities.forEach((cityEntity, index: number) => {
        if (index + 1 >= cities.length)
            return (parkingList = parkingList + `${NumberEmoji[index + 1]} ${cityEntity.name}`);
        parkingList = parkingList + `${NumberEmoji[index + 1]} ${cityEntity.name}\n`;
    });
    return `${chooseParking}\n${parkingList}\n${backToMainMenu}`;
};
