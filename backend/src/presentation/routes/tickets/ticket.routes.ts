import { Router } from "express";
import { TicketParkingDatasourceMongo } from "../../../infrastructure/datasources";
import { TicketRepositoryImpl } from "../../../infrastructure/repositories";
import { TicketController } from "./ticket.controller";
import { TicketService } from "../../../presentation/services";

export class TicketRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new TicketParkingDatasourceMongo();
        const ticketRepository = new TicketRepositoryImpl(datasource);
        const ticketService = new TicketService(ticketRepository);
        const ticketController = new TicketController(ticketService);

        router.get("/", ticketController.getAll);
        router.get("/:ticketId", ticketController.getById);
        router.post("/", ticketController.createTicket);
        router.put("/:id", ticketController.updateTicket);

        return router;
    }
}
