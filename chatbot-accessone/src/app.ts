import { envs } from "./config/plugins/envs.plugin";
import { AppRoutes } from "./presentation/routes/routes";
import { Server } from "./presentation/server";

(async () => {
    main();
})();

async function main() {

    const server = new Server({
        port: envs.PORT,
        publicPath: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    });
 
    server.start();
}
