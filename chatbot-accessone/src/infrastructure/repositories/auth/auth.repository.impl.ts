import { AuthDatasource, LoginResponseInterface } from "../../../domain/datasources";
import { RegisterUserDto } from "../../../domain/dtos";
import { UserEntity } from "../../../domain/entities";
import { AuthRepository } from "../../../domain/repository";

export class AuthRepositoryImpl implements AuthRepository {
    constructor(
        private readonly authDatasource: AuthDatasource //<---
    ) {}
    validateEmail(email: string): Promise<UserEntity> {
        return this.authDatasource.validateEmail(email);
    }
    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.authDatasource.register(registerUserDto);
    }
    login(email: string, password: string): Promise<UserEntity> {
        return this.authDatasource.login(email, password);
    }
    renewToken(id: string):  Promise<UserEntity> {
        return this.authDatasource.renewToken(id);
    }
}
