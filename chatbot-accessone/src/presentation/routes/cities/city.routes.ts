import { Router } from "express";
import { MongoCityDatasource } from "../../../infrastructure/datasources";
import { CityRepositoryImpl } from "../../../infrastructure/repositories";
import { CityController } from "./city.controller";

export class CityRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new MongoCityDatasource();
        const cityRepository = new CityRepositoryImpl(datasource);
        const cityController = new CityController(cityRepository);

        router.get("/", cityController.getAll);
        router.get("/:cityId", cityController.getById);
        router.post("/", cityController.createCity);
        router.put("/:id", cityController.updateCity);

        return router;
    }
}
