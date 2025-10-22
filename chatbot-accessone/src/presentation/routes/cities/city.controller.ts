import { Request, Response } from "express";
import { CreateCityDto } from "../../../domain/dtos";
import { CityRepository } from "../../../domain/repository";

export class CityController {
    constructor(private readonly cityRepository: CityRepository) {}

    public getById = async (req: Request, res: Response) => {
        
        const { cityId } = req.params;
        try {
            const city = await this.cityRepository.getById(cityId);
            return res.json(city);
        } catch (error) {
            res.status(400).json({ error });
        }
    };

    public getAll = async (req: Request, res: Response) => {
        const parkings = await this.cityRepository.getAll();
        return res.json(parkings);
    };

    public createCity = async (req: Request, res: Response) => {
        const [error, createCityDto] = CreateCityDto.create(req.body);
        if (error || createCityDto == undefined) return res.status(400).json({ error });
        const parking = await this.cityRepository.saveCity(createCityDto);

        return res.json(parking);
    };

    public updateCity = async (req: Request, res: Response) => {
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
