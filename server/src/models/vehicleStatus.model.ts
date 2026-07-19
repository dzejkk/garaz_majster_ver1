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
      let remainingDays = null;
      let status = "OK";

      // Vypocet Kilometrov

      if (
        task.intervalKm &&
        task.lastPerformedOdometer &&
        vehicle.currentOdometer
      ) {
        const nextServiceAtKm =
          Number(task.lastPerformedOdometer) + Number(task.intervalKm);
        remainingKm = nextServiceAtKm - Number(vehicle.currentOdometer);
      }

      if (remainingKm !== null && remainingKm <= 0) {
        status = "DUE";
      } else if (remainingKm !== null && remainingKm <= 1500) {
        status = "WARNING";
      }

      // VYPOCET CASU

      if (task.intervalMonths && task.lastPerformedDate) {
        const lastDate = new Date(task.lastPerformedDate);
        const nextServiceDate = new Date(lastDate);

        nextServiceDate.setMonth(
          nextServiceDate.getMonth() + Number(task.intervalMonths),
        );

        // vypocitame rozdiel oproti dnesku v dnoch

        const today = new Date();
        const diffTime = nextServiceDate.getTime() - today.getTime();
        remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        //urcenie statusu podla casu
        if (remainingDays <= 0) {
          status = "DUE"; // Ak si prešvihol dátum, je jedno že máš rezervu v km
        } else if (remainingDays <= 30 && status !== "DUE") {
          status = "WARNING"; // Upozornenie mesiac vopred (ak už nie je DUE z km)
        }
      }

      return {
        id: task.id,
        title: task.title,
        intervalKm: task.intervalKm,
        intervalMonths: task.intervalMonths,
        lastPerformedOdometer: task.lastPerformedOdometer,
        lastPerformedDate: task.lastPerformedDate,
        remainingKm,
        remainingDays,
        status,
      };
    });

    // 5. Vrátime kompletný balíček pre frontend (Pattern: BFF / Aggregate Endpoint)
    // POZOR: V 'vehicleInfo' musíme vždy vrátiť CELÝ objekt vozidla bez orezávania stĺpcov!
    // Dôvod: Dáta z tohto endpointu slúžia ako 'initialData' pre editačný formulár (VehicleForm).
    // Ak by sme tu vrátili len čiastočné dáta, pri PATCH update by sme v databáze zmazali
    // chýbajúce polia (napr. engine, kW, vin).
    return {
      vehicleInfo: vehicle,
      stats: {
        totalRepairs: Number(stats?.totalRepairs || 0),
        totalSpent: Number(stats?.totalSpent || 0),
      },
      serviceIntervals: taskStatuses,
    };
  },
};
