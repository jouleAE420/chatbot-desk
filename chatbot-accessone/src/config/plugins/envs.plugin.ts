import "dotenv/config";
import * as env from "env-var";

export const envs = {
    PORT: env.get("PORT").required().asPortNumber() ?? 8080,
    PORT_BOT: env.get("PORT_BOT").required().asPortNumber() ?? 8081,
    PUBLIC_PATH: env.get("PUBLIC_PATH").required().asString() ?? "public",
    // ASSISTANT_ID: env.get("ASSISTANT_ID").required().asString(),
    // OPENAI_API_KEY: env.get("OPENAI_API_KEY").required().asString(),

    MAILER_SERVICE: env.get("MAILER_SERVICE").required().asString() ?? "gmail",
    MAILER_EMAIL: env.get("MAILER_EMAIL").required().asEmailString() ?? "",
    MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").required().asString() ?? "",

    MONGO_URL: env.get("MONGO_URL").required().asString() ?? "",
    MONGO_DB_NAME: env.get("MONGO_DB_NAME").required().asString() ?? "",
    MONGO_USER: env.get("MONGO_USER").required().asString() ?? "",
    MONGO_PASS: env.get("MONGO_PASS").required().asString() ?? "",

    ADMON_PHONE: env.get("ADMON_PHONE").required().asString() ?? "",
    ADMON_MAIL: env.get("ADMON_MAIL").required().asEmailString() ?? "",
    JWT_SEED: env.get("JWT_SEED").required().asString() ?? "defaultseed",
    WEB_SERVICE_URL: env.get("WEB_SERVICE_URL").required().asString() ?? "http://localhost:8080",
};
