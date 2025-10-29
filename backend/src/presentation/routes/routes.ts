import { Router } from "express";
import { ParkingRoutes } from "./parkings/parking.routes";
import { CityRoutes } from "./cities/city.routes";
import { AuthRoutes } from "./auth/auth.routes";
import { TicketRoutes } from "./tickets/ticket.routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use("/parkings", ParkingRoutes.routes);
        router.use("/cities", CityRoutes.routes);
        router.use("/auth", AuthRoutes.routes);
        router.use("/tickets", TicketRoutes.routes);

        return router;
    }
}
