import { CreateCityDto } from "../../dtos";
import { CityEntity } from "../../entities/cities/city.entity";

export abstract class CityRepository {
    abstract saveCity(parking: CreateCityDto): Promise<CityEntity>;
    abstract getAll(): Promise<CityEntity[]>;
    abstract getById(cityId: string): Promise<CityEntity>;
    
}
