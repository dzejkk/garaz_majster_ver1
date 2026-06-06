import { db } from "../db/index.js";
import { serviceLogs } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const serviceLogModel = {
  // Pridať nový servisný záznam
  create: async (data: any) => {
    const [newLog] = await db.insert(serviceLogs).values(data).returning();
    return newLog;
  },

  // Vytiahnuť celú servisnú históriu pre konkrétne auto
  findByVehicleId: async (vehicleId: string) => {
    return await db.query.serviceLogs.findMany({
      where: eq(serviceLogs.vehicleId, vehicleId as any),
      orderBy: (logs, { desc }) => [desc(logs.odometerAtService)], // Najnovší servis podľa km bude hore
    });
  },
};
