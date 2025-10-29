import { addKeyword, EVENTS } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
import { selectParkingsFlow } from "./select-parkings-flow";
import { welcomeFlow } from "./welcome-flow";
import { MongoCityDatasource } from "../../../../infrastructure/datasources";
import { CityRepositoryImpl } from "../../../../infrastructure/repositories";
import { CityEntity } from "../../../../domain/entities";
import { NumberEmoji, strings } from "../../../../config";

export const flowToCity = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic, state }) => {
        const datasource = new MongoCityDatasource();
        const cityRepository = new CityRepositoryImpl(datasource);
        const cities = (await cityRepository.getAll()).sort((a, b) => a.name.localeCompare(b.name));

        await state.update({ cities: cities });
        const message = makeCitiesString(cities);
        return await flowDynamic(message);
    })
    .addAction({ capture: true, delay: 800 }, async (ctx, { fallBack, gotoFlow, state }) => {
        const cities: CityEntity[] = state.get("cities");
        const answer = parseInt(ctx.body);
        if (answer === 0) return gotoFlow(welcomeFlow);
        if (!answer || answer > cities.length) {
            return fallBack(strings.es.whatsappBot.chooseValidOption);
        }
        await state.update({ selectedCity: cities[answer - 1] });

        return gotoFlow(selectParkingsFlow);
    });

const makeCitiesString = (cities: CityEntity[]): string => {
    const { chooseCity, backToMainMenu } = strings.es.whatsappBot;
    // Convierte un número a emojis (ej: 12 -> 1️⃣2️⃣)
    const numberToEmoji = (num: number) =>
        num
            .toString()
            .split("")
            .map((d) => NumberEmoji[+d])
            .join("");
    // Arma la lista de ciudades con numeración en emojis
    const citiesList = cities.map((c, i) => `${numberToEmoji(i + 1)} ${c.name}`).join("\n");

    return `${chooseCity}\n${citiesList}\n${backToMainMenu}`;
};
