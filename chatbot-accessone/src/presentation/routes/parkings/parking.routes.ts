import { Router } from "express";
import { ParkingController } from "./parking.controller";
import { MongoParkingDatasource } from "../../../infrastructure/datasources";
import { ParkingRepositoryImpl } from "../../../infrastructure/repositories";

export class ParkingRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new MongoParkingDatasource();
        const parkingRepository = new ParkingRepositoryImpl(datasource);
        const parkingController = new ParkingController(parkingRepository);

        router.get("/city/:cityId", parkingController.getByCity);
        router.get("/", parkingController.getAll);
        router.get("/:parkingId", parkingController.getById);
        router.post("/", parkingController.createParking);
        router.put("/:id", parkingController.updateParking);

        return router;
    }
}
