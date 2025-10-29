import { ParkingDatasource } from "../../../domain/datasources";
import { ParkingRepository } from "../../../domain/repository";
import { ParkingEntity } from "../../../domain/entities";
import { CreateParkingDto } from "../../../domain/dtos";

export class ParkingRepositoryImpl implements ParkingRepository {
    constructor(private readonly parkingDatasource: ParkingDatasource) {}
    getById(parkingId: string): Promise<ParkingEntity> {
        return this.parkingDatasource.getById(parkingId);
    }
    getAll(): Promise<ParkingEntity[]> {
        return this.parkingDatasource.getAll();
    }

    updateById(id: string): Promise<ParkingEntity> {
        return this.parkingDatasource.updateById(id);
    }
    deleteById(id: string): Promise<ParkingEntity> {
        return this.parkingDatasource.deleteById(id);
    }

    saveParking(createParkingDto: CreateParkingDto): Promise<ParkingEntity> {
        return this.parkingDatasource.saveParking(createParkingDto);
    }

    getByCity(cityId: string): Promise<ParkingEntity[]> {
        return this.parkingDatasource.getByCity(cityId);
    }
}
