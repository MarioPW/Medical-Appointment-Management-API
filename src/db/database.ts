import { knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_PASSWORD) {
  throw new Error("⚠️ DB_PASSWORD is not defined in the .env file");
}

export const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD
  }
});

export default db;