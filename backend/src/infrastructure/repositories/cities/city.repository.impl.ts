import { CityRepository } from "../../../domain/repository";
import { CreateCityDto } from "../../../domain/dtos";
import { CityDatasource } from "../../../domain/datasources";
import { CityEntity } from "../../../domain/entities";

export class CityRepositoryImpl implements CityRepository {
    constructor(private readonly cityDatasource: CityDatasource) {}
    getById(cityId: string): Promise<CityEntity> {
        return this.cityDatasource.getById(cityId);
    }

    saveCity(parking: CreateCityDto): Promise<CityEntity> {
        return this.cityDatasource.saveCity(parking);
    }
    getAll(): Promise<CityEntity[]> {
        return this.cityDatasource.getAll();
    }
}
