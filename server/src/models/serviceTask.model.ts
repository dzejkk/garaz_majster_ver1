import { db } from "../db/index.js";
import { serviceTasks } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const serviceTaskModel = {
  // Vytvoriť nový plánovaný interval
  create: async (data: any) => {
    const [newTask] = await db.insert(serviceTasks).values(data).returning();
    return newTask;
  },

  // Získať všetky naplánované intervaly pre jedno auto
  findByVehicleId: async (vehicleId: string) => {
    return await db.query.serviceTasks.findMany({
      where: eq(serviceTasks.vehicleId, vehicleId as any),
    });
  },
};
