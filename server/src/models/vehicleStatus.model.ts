import { db } from "../db/index.js";
import { vehicles, serviceLogs, serviceTasks } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const vehicleStatusModel = {
  getVehicleStatus: async (vehicleId: string) => {
    // 1. Vytiahneme auto (aby sme vedeli aktuálny stav tachometra)
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, vehicleId as any));
    if (!vehicle) throw new Error("Vozidlo nebolo nájdené");

    // 2. Vytiahneme základné štatistiky z histórie servisu (počet opráv a celková cena)
    const [stats] = await db
      .select({
        totalRepairs: sql<number>`count(${serviceLogs.id})`, // drizzle feature pre raw sql query
        totalSpent: sql<number>`coalesce(sum(${serviceLogs.cost}), 0)`,
      })
      .from(serviceLogs)
      .where(eq(serviceLogs.vehicleId, vehicleId as any));

    // 3. Vytiahneme naplánované úlohy/intervaly
    const tasks = await db
      .select()
      .from(serviceTasks)
      .where(eq(serviceTasks.vehicleId, vehicleId as any));

    // 4. Prejdeme každú úlohu a prepočítame jej reálny stav
    const taskStatuses = tasks.map((task) => {
      let remainingKm = null;
      let status = "OK";

      if (task.intervalKm && task.lastPerformedOdometer) {
        // Výpočet: Kedy má byť ďalší servis (posledný + interval)
        const nextServiceAtKm =
          Number(task.lastPerformedOdometer) + Number(task.intervalKm);
        // Koľko km zostáva (ďalší servis - aktuálny tachometer auta)
        remainingKm = nextServiceAtKm - Number(vehicle.currentOdometer);

        // Určenie statusu podľa zostávajúcich kilometrov
        if (remainingKm <= 0) {
          status = "DUE";
        } else if (remainingKm <= 1500) {
          status = "WARNING";
        }
      }

      return {
        id: task.id,
        title: task.title,
        intervalKm: task.intervalKm,
        lastPerformedOdometer: task.lastPerformedOdometer,
        remainingKm,
        status,
      };
    });

    // 5. Vrátime kompletný prehľadný balíček pre frontend
    return {
      vehicleInfo: {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        currentOdometer: vehicle.currentOdometer,
        vin: vehicle.vin,
      },
      stats: {
        totalRepairs: Number(stats?.totalRepairs || 0),
        totalSpent: Number(stats?.totalSpent || 0),
      },
      serviceIntervals: taskStatuses,
    };
  },
};
