// apps/ws-backend/src/config.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const JWT_SECRET = process.env.JWT_SECRET!;
export const DB_HOST = process.env.DB_HOST!;
export const PORT = process.env.PORT!;
