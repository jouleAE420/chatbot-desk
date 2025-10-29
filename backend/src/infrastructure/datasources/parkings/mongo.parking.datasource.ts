import { ParkingEntity } from "../../../domain/entities";
import { ParkingModel } from "../../../data/mongo";
import { CreateParkingDto } from "../../../domain/dtos";
import { ParkingDatasource } from "../../../domain/datasources";

export class MongoParkingDatasource implements ParkingDatasource {
    async getById(parkingId: string): Promise<ParkingEntity> {
        const parkingDB = await ParkingModel.findById(parkingId);
        if (!parkingDB) throw new Error("There's no any parking with that ID");
        const parking: ParkingEntity = ParkingEntity.fromObject(parkingDB);
        return parking;
    }

    async getAll(): Promise<ParkingEntity[]> {
        const parkings = await ParkingModel.find();
        return parkings.map(ParkingEntity.fromObject);
    }

    updateById(id: string): Promise<ParkingEntity> {
        throw new Error("Method not implemented.");
    }

    deleteById(id: string): Promise<ParkingEntity> {
        throw new Error("Method not implemented.");
    }

    async saveParking(createParkingDto: CreateParkingDto): Promise<ParkingEntity> {
        const parking = new ParkingModel(createParkingDto.createParkingDto);
        await parking.save();
        return ParkingEntity.fromObject(parking);
    }

    async getByCity(cityId: string): Promise<ParkingEntity[]> {
        const parkings = await ParkingModel.find({ city: cityId });
        return parkings.map(ParkingEntity.fromObject);
    }
}
