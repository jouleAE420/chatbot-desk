import { CreateCityDto } from "../../../domain/dtos";
import { CityEntity } from "../../../domain/entities";


export abstract class CityDatasource {
    abstract saveCity(createCityDto: CreateCityDto): Promise<CityEntity>;
    abstract getById(cityId: string): Promise<CityEntity>;

    abstract getAll(): Promise<CityEntity[]>;
}
