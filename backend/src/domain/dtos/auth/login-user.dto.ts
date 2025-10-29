import { regularExps } from "../../../config/";

export interface LoginUserDtoInterface {
    email: string;
    password: string;
    // rol: string;
}
export class LoginUserDto {
    private constructor(public readonly loginUserDto: LoginUserDtoInterface) {}
    static create(props: { [key: string]: any }): [string?, LoginUserDto?] {
        const { email, password } = props;

        if (!email || !password) return ["You're missing some property"];
        if (!regularExps.email.test(email)) return ["Email is not valid"];
        if (password.length < 6) return ["Password too short "];
        return [
            undefined,
            new LoginUserDto({
                email,
                password,
            }),
        ];
    }
}
