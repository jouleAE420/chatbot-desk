import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
import { MongoParkingDatasource, MongoCityDatasource } from "../../../../infrastructure/datasources";

import { welcomeFlow } from "../flows";
import { CityEntity, ParkingEntity } from "../../../../domain/entities";
import { CityRepositoryImpl, ParkingRepositoryImpl } from "../../../../infrastructure/repositories";
import { strings } from "../../../../config/";

const regexMongoIdToBot = "/^PARKING CODE: [a-fA-F0-9]{24}$/i";
export const directParkingFlow = addKeyword<Provider, Database>(regexMongoIdToBot, {
    regex: true,
}).addAction(async (ctx, { state, gotoFlow, flowDynamic, fallBack }) => {
    const message = ctx.body.trim();
    const parkingId = message.split(" ")[2];
    try {

        //TODO: IMPLIMENTAR UN SERVICE QUE HAGA ESTO
        const parking = await getParking(parkingId);
        //TODO: IMPLIMENTAR UN SERVICE QUE HAGA ESTO
        const city = await getCity(parking.city);
        
        await state.update({ selectedParking: parking });
        await state.update({ selectedCity: city });
        flowDynamic(`🅿️ ${parking.name}\n🌆 ${city.name}`);
        return gotoFlow(welcomeFlow);
    } catch (error) {
        flowDynamic(strings.es.whatsappBot.noParkingId);
        gotoFlow(welcomeFlow);
    }
});

const getParking = async (parkingId: string): Promise<ParkingEntity> => {
    const parkingDatasource = new MongoParkingDatasource();
    const parkingRepository = new ParkingRepositoryImpl(parkingDatasource);
    const parking = await parkingRepository.getById(parkingId);
    return parking;
};

const getCity = async (cityId: string): Promise<CityEntity> => {
    const cityDatasource = new MongoCityDatasource();
    const cityRepository = new CityRepositoryImpl(cityDatasource);
    const city = await cityRepository.getById(cityId);
    return city;
};
