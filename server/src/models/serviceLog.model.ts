import { db } from "../db/index.js";
import { serviceLogs, serviceTasks } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const serviceLogModel = {
  // Pridať nový servisný záznam
  create: async (data: any) => {
    const [newLog] = await db.insert(serviceLogs).values(data).returning();
    return newLog;
  },

  updateTaskLastPerformed: async ({
    taskId,
    odometer,
    date, // OPRAVENÉ: Prijímame objekt, nie pozičné argumenty
  }: {
    taskId: string;
    odometer: number;
    date: string;
  }) => {
    return await db
      .update(serviceTasks)
      .set({
        lastPerformedOdometer: odometer,
        lastPerformedDate: date,
      })
      .where(eq(serviceTasks.id, taskId));
  },

  // Vytiahnuť celú servisnú históriu pre konkrétne auto
  findByVehicleId: async (vehicleId: string) => {
    return await db.query.serviceLogs.findMany({
      where: eq(serviceLogs.vehicleId, vehicleId as any),
      orderBy: (logs, { desc }) => [desc(logs.odometerAtService)], // Najnovší servis podľa km bude hore
    });
  },
};
