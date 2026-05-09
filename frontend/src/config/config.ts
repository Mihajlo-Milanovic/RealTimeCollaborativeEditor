// import {configDotenv} from "dotenv";

// configDotenv();
export const WS_PORT = process.env.WS_PORT || 3000;
export const ENV = process.env.ENV || "dev";
export const NEXT_AUTH_URL = process.env.NEXTAUTH_URL || "";
export const EMAIL_USER = process.env.EMAIL_USER || "";
export const EMAIL_APP_PASS = process.env.EMAIL_APP_PASS || "";