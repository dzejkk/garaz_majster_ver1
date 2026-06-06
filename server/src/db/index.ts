import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import dotenv from "dotenv";

dotenv.config();

// Vytvoríme pool (bazén) pripojení k tvojmu lokálnemu Postgresu
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializujeme Drizzle s našou schémou
export const db = drizzle(pool, { schema });
