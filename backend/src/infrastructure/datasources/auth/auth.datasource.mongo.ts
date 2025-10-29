import { UserModel } from "../../../data/mongo";
import { AuthDatasource } from "../../../domain/datasources";
import bcryptjs from "bcryptjs";
import { RegisterUserDto } from "../../../domain/dtos";
import { CustomError } from "../../../domain/errors/custom.error";
import { UserEntity } from "../../../domain/entities";

export class AuthMongoDatasource implements AuthDatasource {
    async validateEmail(email: string): Promise<UserEntity> {
        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.badRequest("User Not Found");
        user.emailValidated = true;
        await user.save();
        return UserEntity.fromObject(user);
    }
    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { email } = registerUserDto.registerUserDto;
        const uniqueMail = await UserModel.findOne({ email });
        if (uniqueMail) throw CustomError.badRequest(`email ${email} already exists`);

        const user = new UserModel(registerUserDto.registerUserDto);
        await user.save();
        return UserEntity.fromObject(user);
    }

    async login(email: string, password: string): Promise<UserEntity> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw CustomError.badRequest(`User with email ${email} doesn't exist`);
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw CustomError.badRequest("Invalid credentials");
        }
        if (!user.state) {
            throw CustomError.badRequest(`User with email ${email} is not active`);
        }
        return UserEntity.fromObject(user);
    }
    async renewToken(id: string): Promise<UserEntity> {
        const user = await UserModel.findById(id);
        if (!user || !user.state) throw CustomError.badRequest(`User with id ${id} doesn't exists`);
        return UserEntity.fromObject(user);
    }
}
