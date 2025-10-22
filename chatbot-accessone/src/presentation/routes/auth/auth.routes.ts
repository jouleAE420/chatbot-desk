import { Router } from "express";
import { AuthController } from "./auth.controller";
import { envs } from "../../../config";
import { AuthService, EmailService } from "../../../presentation/services";
import { AuthMongoDatasource } from "../../../infrastructure/datasources";
import { AuthRepositoryImpl } from "../../../infrastructure/repositories";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const emailService = new EmailService(
        );
        const datasource = new AuthMongoDatasource();
        const authRepository = new AuthRepositoryImpl(datasource);
        const authService = new AuthService(authRepository, emailService, envs.WEB_SERVICE_URL);
        const authController = new AuthController(authService);

        router.post("/register", authController.registerUser);
        router.post("/login", authController.loginUser);
        router.get("/validate-email/:token", authController.validateEmail);
        router.post("/renew-token/:token", authController.renewToken);
        return router;
    }
}
