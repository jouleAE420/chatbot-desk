import { AuthRepository } from "../../../domain/repository";
import { EmailService } from "../email/email.service";
import { LoginUserDto, RegisterUserDto } from "../../../domain/dtos";
import { bcryptPlugin, emailValidationHTML, JwtPlugin } from "../../../config";
import { UserEntity } from "../../../domain/entities";
import { CustomError } from "../../../domain/errors/custom.error";


export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly emailService: EmailService,
        private readonly webServiceUrl: string
    ) {}
    public async registerUser(registerUserDto: RegisterUserDto) {
        const { password } = registerUserDto.registerUserDto;

        registerUserDto.registerUserDto.password = bcryptPlugin.hash(password);
        const user = await this.authRepository.register(registerUserDto);

        this.sendEmailValidationLink(user.email);

        const { password: shadowPassword, ...userEntity } = UserEntity.fromObject(user);

        const token = await JwtPlugin.generateToken({ id: user.id });

        return { token, user: userEntity };
    }
    
    public async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto.loginUserDto;
        const user = await this.authRepository.login(email, password);
        const validPassword = bcryptPlugin.compare(password, user.password);
        if (!validPassword) throw CustomError.unauthorized("Invalid Credentials");
        const { password: shadowPassword, ...userEntity } = UserEntity.fromObject(user);
        const token = await JwtPlugin.generateToken({ id: user.id });
        if (!token) throw CustomError.internalServer("Error while creating jwt");
        return { token, user: userEntity };
    }

    private sendEmailValidationLink = async (email: string) => {
        const token = await JwtPlugin.generateToken({ email });
        if (!token) throw CustomError.internalServer("Error while creating jwt");
        const link = `${this.webServiceUrl}/auth/validate-email/${token}`;
        const html = emailValidationHTML(link, email);
        const options = { to: email, subject: "Email Validation", htmlBody: html };
        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServer("Error Sending Email");
        return true;
    };

    public validateEmail = async (token: string) => {
        const payload = await JwtPlugin.validateToken(token);
        if (!payload) throw CustomError.unauthorized("invalid token");
        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer("Email not in token");
        const user = await this.authRepository.validateEmail(email);
        return user;
    };

    public renewToken = async (token: string) => {
        const payload = await JwtPlugin.validateToken(token);
        if (!payload) throw CustomError.unauthorized("invalid token");
        const { id } = payload as { id: string };
        if (!id) throw CustomError.internalServer("Id not in token");
        const user = await this.authRepository.renewToken(id);
        const newToken = await JwtPlugin.generateToken({ id });
        return { token: newToken, user };
    };
}
