// import {configDotenv} from "dotenv";

// configDotenv();
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 1236;

export const COLLABORATION_PATH = process.env.COLLABORATION_PATH || "/collaboration";
export const ENV = process.env.ENV || "dev";
export const NEXT_AUTH_URL = process.env.NEXTAUTH_URL || "";
export const EMAIL_USER = process.env.EMAIL_USER || "";
export const EMAIL_APP_PASS = process.env.EMAIL_APP_PASS || "";

export const WS_PROTOCOL = ENV === 'production' ? 'wss' : 'ws';
export const HOST = ENV === 'production' ? 'yourdomain.com' : `localhost`;