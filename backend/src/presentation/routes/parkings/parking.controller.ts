import { Request, Response, RequestHandler } from "express";
import { CreateParkingDto } from "../../../domain/dtos";
import { ParkingRepository } from "../../../domain/repository";

export class ParkingController {
    constructor(private readonly parkingRepository: ParkingRepository) {}

    public getById: RequestHandler = async (req: Request, res: Response) => {
        const { parkingId } = req.params;

        try {
            const parking = await this.parkingRepository.getById(parkingId);
            return res.json(parking);
        } catch (error) {
            res.status(400).json({ error });
        }
    };
    public getAll: RequestHandler = async (req: Request, res: Response) => {

        try {
            const parkings = await this.parkingRepository.getAll();
            return res.json(parkings);
        } catch (error) {
            res.status(400).json({ error });
        }
    };



    public getByCity: RequestHandler = async (req: Request, res: Response) => {
        const { cityId } = req.params;
        const parkings = await this.parkingRepository.getByCity(cityId);
        return res.json(parkings);
    };

    public createParking = async (req: Request, res: Response) => {
        const [error, createParkingDto] = CreateParkingDto.create(req.body);
        if (error || createParkingDto == undefined) return res.status(400).json({ error });
        
        const parking = await this.parkingRepository.saveParking(createParkingDto);
        return res.json(parking);
    };

    public updateParking = async (req: Request, res: Response) => {
        const { id } = req.params;
        // const [error, updateParkingDto] = UpdateParkingDto.update(req.body);
        // const parking = await ParkingModel.findById(id);
        // if (!parking) return res.status(404).json({ error: `Parking with id ${id} not found` });
        // if (error) return res.status(400).json({ error });
        // // const { name, address, city, rate, email } = updateParkingDto?.values!;
        // const uptatedParking = await ParkingModel.findByIdAndUpdate(id, updateParkingDto?.values, {
        //     new: true,
        // });
        return res.json(id);
    };
}
