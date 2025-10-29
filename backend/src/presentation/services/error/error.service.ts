import { Response } from "express";
import { CustomError } from "../../../domain/errors/custom.error";

export class ErrorService {
    constructor() {}

    static handleApiError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        return res.status(500).json({ error: "internal server error" });
    }
}


