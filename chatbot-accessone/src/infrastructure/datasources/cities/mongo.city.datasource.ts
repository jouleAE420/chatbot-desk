import { CityDatasource } from "../../../domain/datasources";
import { CityModel } from "../../../data/mongo";
import { CreateCityDto } from "../../../domain/dtos";
import { CityEntity } from "../../../domain/entities";

export class MongoCityDatasource implements CityDatasource {
    async getById(cityId: string): Promise<CityEntity> {
        const cityDB = await CityModel.findById(cityId);
        if (!cityDB) throw new Error("There's no any city with that ID");
        const city: CityEntity = CityEntity.fromObject(cityDB);
        return city;
    }
    async saveCity(createCityDto: CreateCityDto): Promise<CityEntity> {
        const city = new CityModel(createCityDto.createCityDto);
        await city.save();
        return CityEntity.fromObject(city);
    }
    async getAll(): Promise<CityEntity[]> {
        const cities = await CityModel.find();
        return cities.map(CityEntity.fromObject);
    }
}
