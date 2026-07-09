import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { time } from "node:console";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(), // ID, ktoré nám vráti Clerk
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Ak sa zmaže užívateľ, zmažú sa aj autá
  make: varchar("make", { length: 50 }).notNull(),
  model: varchar("model", { length: 50 }).notNull(),
  year: integer("year"),
  vin: varchar("vin", { length: 17 }),
  engine: varchar("engine", { length: 100 }),
  fuelType: varchar("fuel_type", { length: 30 }),
  enginePowerKw: integer("engine_power_kw"),
  currentOdometer: integer("current_odometer").default(0).notNull(),

  // pridane kvoly zoradovania logov aut

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serviceTasks = pgTable("service_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  intervalKm: integer("interval_km"),
  intervalMonths: integer("interval_months"),
  lastPerformedOdometer: integer("last_performed_odometer"),
  lastPerformedDate: date("last_performed_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const serviceLogs = pgTable("service_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }), // Ak sa zmaže auto, zmaže sa aj jeho servisná história
  title: varchar("title", { length: 100 }).notNull(), // napr. "Výmena motorového oleja"
  description: varchar("description", { length: 1000 }), // detaily: "Filter Mann, olej Mobil 1 5W-30"
  odometerAtService: integer("odometer_at_service").notNull(), // Pri akých km sa servis robil
  serviceDate: date("service_date").notNull(), // Kedy sa servis robil
  cost: integer("cost"), // Cena servisu v eurách (voliteľné)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
