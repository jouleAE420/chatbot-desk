import { CustomError } from "../../errors/custom.error";

export interface UserEntityOptions {
    id: string;
    name: string;
    email: string;
    password: string;
    rol: string;
    emailValidated: boolean;
    state: boolean;
    deviceToken: string[];
    parkings: [];
}

export class UserEntity {
    public id: string;
    public name: string;
    public email: string;
    public password: string;
    public rol: string;
    public state: boolean;
    public emailValidated: boolean;

    public deviceToken: string[];
    public parkings: [];

    constructor(options: UserEntityOptions) {
        const { id, name, email, password, rol, state, deviceToken, parkings, emailValidated } =
            options;
        this.id = id;
        this.emailValidated = emailValidated;
        this.name = name;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.state = state;
        this.deviceToken = deviceToken;
        this.parkings = parkings;
    }

    static fromJson = (json: string): UserEntity => {
        const { id, name, email, password, rol, state, deviceToken, parkings, emailValidated } =
            JSON.parse(json);
        const user = new UserEntity({
            id,
            name,
            email,
            password,
            rol,
            state,
            deviceToken,
            parkings,
            emailValidated,
        });
        return user;
    };
    static fromObject = (object: { [key: string]: any }): UserEntity => {
        const {
            _id,
            id,
            name,
            email,
            password,
            rol,
            state,
            deviceToken,
            parkings,
            emailValidated,
        } = object;

        if (!_id && !id) throw CustomError.badRequest("Missing id");
        if (!email) throw CustomError.badRequest("Missing email");
        if (!password) throw CustomError.badRequest("Missing password");
        if (!rol) throw CustomError.badRequest("Missing rol");
        if (!state) throw CustomError.badRequest("Missing state");
        if (!deviceToken) throw CustomError.badRequest("Missing deviceToken");
        if (!parkings) throw CustomError.badRequest("Missing parkings");
        if (emailValidated === undefined) throw CustomError.badRequest("Missing emailValidated");

        const user = new UserEntity({
            id,
            name,
            email,
            password,
            rol,
            state,
            deviceToken,
            parkings,
            emailValidated,
        });
        return user;
    };
}
