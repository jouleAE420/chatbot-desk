import { UserEntity } from "../../../domain/entities";
import { RegisterUserDto } from "../../dtos";

export abstract class AuthRepository {
    abstract login(email: string, password: string): Promise<UserEntity>;
    abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
    abstract validateEmail(email: string): Promise<UserEntity>;
    abstract renewToken(id: string): Promise<UserEntity>;
}
