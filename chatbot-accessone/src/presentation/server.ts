import { envs } from "../config/plugins/envs.plugin";
import { WhatsappBot } from "../presentation/services";
import { MongoDatabase } from "../data/mongo";
import express, { Router } from "express";
import path from "path";
import { ParkingRepositoryImpl } from "../infrastructure/repositories/";
import { MongoParkingDatasource } from "../infrastructure/datasources/";
import cors from "cors";
interface ServerOptions {
    port: number;
    publicPath?: string;
    routes: Router;
}
export class Server {
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;
    private app = express();
    public static mongoRepository = new ParkingRepositoryImpl(new MongoParkingDatasource());

    constructor(options: ServerOptions) {
        const { port, publicPath = "public", routes } = options;
        this.routes = routes;
        this.port = port;
        this.publicPath = publicPath;
    }

    public async start() {
        await MongoDatabase.connect({ dbName: envs.MONGO_DB_NAME, mongoUrl: envs.MONGO_URL });

        console.log("SERVER STARTED...");

        //WhatsappBot.startBotServer(envs.PORT_BOT);

        //*MIDDLEWARES
        this .app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        //* Public Folder
        this.app.use(express.static(this.publicPath));

        //*ROUTES
        this.app.use(this.routes);
        //*SPA
        this.app.get("*", (req, res) => {
            const indexPath = path.join(__dirname + `../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        });

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
