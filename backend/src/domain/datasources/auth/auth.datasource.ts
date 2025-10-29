import { RegisterUserDto } from "../../dtos";
import { UserEntity } from "../../entities/";

export interface LoginResponseInterface {
    user: UserEntity;
    token: string;
}

export abstract class AuthDatasource {
    abstract login(email: string, password: string): Promise<UserEntity>;
    abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
    abstract validateEmail(email: string): Promise<UserEntity>;
    abstract renewToken(id: string): Promise<UserEntity>;
}
