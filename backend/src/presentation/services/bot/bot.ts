import { createBot, createProvider, createFlow,} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

import {
    commentFlow,
    directParkingFlow,
    flowToCity,
    selectParkingsFlow,
    welcomeFlow,
} from "./flows";

export class WhatsappBot {
    public static async startBotServer(port: number) {
        const adapterFlow = createFlow([
            commentFlow,
            selectParkingsFlow,
            flowToCity,
            welcomeFlow,
            directParkingFlow,
        ]);

        const adapterProvider = createProvider(Provider);
        const adapterDB = new Database();

        const { handleCtx, httpServer } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });

        // --- Endpoints HTTP ---
        adapterProvider.server.post(
            "/v1/messages",
            handleCtx(async (bot, req, res) => {
                try {
                    
                    const { to, message, urlMedia } = req.body;
    
                    await bot!.sendMessage(to, message, { media: urlMedia ?? null });
                    return res.end("sended");
                } catch (error) {
                    res.status(500).json(error);
                }
            })
        );

        adapterProvider.server.post(
            "/v1/register",
            handleCtx(async (bot, req, res) => {
                const { number, name } = req.body;
                await bot!.dispatch("REGISTER_FLOW", { from: number, name });
                return res.end("trigger");
            })
        );

        adapterProvider.server.post(
            "/v1/samples",
            handleCtx(async (bot, req, res) => {
                const { number, name } = req.body;
                await bot!.dispatch("SAMPLES", { from: number, name });
                return res.end("trigger");
            })
        );

        adapterProvider.server.post(
            "/v1/blacklist",
            handleCtx(async (bot, req, res) => {
                const { number, intent } = req.body;
                if (intent === "remove") bot!.blacklist.remove(number);
                if (intent === "add") bot!.blacklist.add(number);
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ status: "ok", number, intent }));
            })
        );

        httpServer(port);
    }
}
