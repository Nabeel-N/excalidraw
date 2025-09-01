// config.ts
import dotenv from "dotenv";
import path from "path";

// Load the .env file. Adjust the relative path as necessary.
// Here, we assume the .env file is one folder up from the config.ts file.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Export the variables you need.
// You can provide default values if needed.
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretvalue";
export const DB_HOST = process.env.DB_HOST || "default_host";
export const PORT = process.env.PORT || "3005";
