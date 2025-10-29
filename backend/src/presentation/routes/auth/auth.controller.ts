import { Request, Response } from "express";
import { LoginUserDto, RegisterUserDto } from "../../../domain/dtos";
import { AuthService, ErrorService } from "../../services";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });
        this.authService
            .registerUser(registerUserDto!)
            .then((user) => res.json(user))
            .catch((error) => ErrorService.handleApiError(error, res));
    };

    loginUser = (req: Request, res: Response) => {
        console.log('Request Body:', req.body);
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        console.log('Login DTO Error:', error);
        if (error) return res.status(400).json({ error });
        this.authService
            .loginUser(loginUserDto!)
            .then((user) => res.json(user))
            .catch((error) => ErrorService.handleApiError(error, res));
    };

    validateEmail = async (req: Request, res: Response) => {
        const { token } = req.params;
        const user = await this.authService
            .validateEmail(token)
            .then((user) => res.json(user))
            .catch((error) => ErrorService.handleApiError(error, res));
    };

    renewToken = async (req: Request, res: Response) => {
        const { token } = req.params;
        const user = await this.authService
            .renewToken(token)
            .then((user) => res.json(user))
            .catch((error) => ErrorService.handleApiError(error, res));
    };
}
