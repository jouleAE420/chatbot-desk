import { regularExps } from "../../../config/";

export interface RegisterUserDtoInterface {
    name: string;
    email: string;
    password: string;
    // rol: string;
}
export class RegisterUserDto {
    private constructor(public readonly registerUserDto: RegisterUserDtoInterface) {}
    static create(props: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { name, email, password } = props;
        
        if (!name || !email || !password) return ["You're missing some property"];
        if (!regularExps.email.test(email)) return ["Email is not valid"];
        if (password.length < 6) return ["Password too short "];
        return [
            undefined,
            new RegisterUserDto({
                name,
                email,
                password,
            }),
        ];
    }
}
