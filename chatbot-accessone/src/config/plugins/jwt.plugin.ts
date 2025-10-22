import jwt, { TokenExpiredError } from "jsonwebtoken";
import { resolve } from "path";
import { envs } from "./envs.plugin";

export class JwtPlugin {
    // DI?
    static async generateToken(payload: any, duration: number = 60 * 60 * 2) {
        //Duration on seconds
        return new Promise((resolve) => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                resolve(token);
            });
        });
    }

    static validateToken(token: string) {
        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_SEED, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded);
            });
        });
    }
}
