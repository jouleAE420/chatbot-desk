import { Router } from "express";
import { ParkingRoutes } from "./parkings/parking.routes";
import { CityRoutes } from "./cities/city.routes";
import { AuthRoutes } from "./auth/auth.routes";
import { TicketRoutes } from "./tickets/ticket.routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use("/api/parkings", ParkingRoutes.routes);
        router.use("/api/cities", CityRoutes.routes);
        router.use("/api/auth", AuthRoutes.routes);
        router.use("/api/tickets", TicketRoutes.routes);

        return router;
    }
}
