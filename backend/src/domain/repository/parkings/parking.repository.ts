import { CreateParkingDto } from "../../../domain/dtos";
import { ParkingEntity } from "../../../domain/entities";

export abstract class ParkingRepository {
    abstract saveParking(createParkingDto: CreateParkingDto): Promise<ParkingEntity>;
    abstract getByCity(cityId: string): Promise<ParkingEntity[]>;
    abstract getAll(): Promise<ParkingEntity[]>;
    abstract updateById(id: string): Promise<ParkingEntity>;
    abstract deleteById(id: string): Promise<ParkingEntity>;
    abstract getById(parkingId: string): Promise<ParkingEntity>;

}
