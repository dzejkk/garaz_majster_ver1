export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  currentOdometer: number;
}
export interface ServiceInterval {
  id: string;
  title: string;
  intervalKm: number;
  intervalMonths: number | null;
  lastPerformedOdometer: number;
  lastPerformedDate: string | null;
  remainingKm: number;
  remainingDays: number | null;
  status: "OK" | "WARNING" | "DUE";
}
export interface VehicleStatus {
  vehicleInfo: Vehicle;
  stats: {
    totalRepairs: number;
    totalSpent: number;
  };
  serviceIntervals: ServiceInterval[];
}
export interface VehicleServisLogs {
  id: string;
  title: string;
  description: string;
  odometerAtService: number;
  serviceDate: string; // zmenene s date  na string
  cost: number;
  createdAt: string; // zmenene s time na string
}
export interface CreateServiceLogPayload {
  vehicleId: string;
  title: string;
  description: string;
  cost: number;
  odometerAtService: number;
  serviceDate: string;
  serviceTaskId: string | null; // ID úlohy, ktorú tento servis vyresetuje
}

//
//
//

// pouzivame nativny JS  fetch, + Vite proxy pre zavolanie serveru
export const vehiclesApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await fetch("/api/vehicles");
    if (!response.ok) {
      throw new Error("Nepodarilo sa načítať vozidlá");
    }
    return response.json();
  },

  // nova funkcia pre  car detail
  getCarStatus: async (vehicleId: string): Promise<VehicleStatus> => {
    const response = await fetch(`/api/vehicles/${vehicleId}/status`);

    if (!response.ok) {
      throw new Error("nepodarilo sa nacitat status");
    }
    return response.json();
  },

  // nova funckia pre Servis Detail History
  getCarServiceLogs: async (
    vehicleId: string,
  ): Promise<VehicleServisLogs[]> => {
    const response = await fetch(`/api/service-logs/vehicle/${vehicleId}`);

    if (!response.ok) {
      throw new Error("chyba pri nacitani servis logu");
    }

    return response.json();
  },

  // nova  POST metoda pre  vytvorenie  servis logu

  createCarServiceLogs: async (
    data: CreateServiceLogPayload,
  ): Promise<CreateServiceLogPayload[]> => {
    const response = await fetch("/api/service-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Nepodarilo sa vytvorit servisny zaznam");
    }
    return response.json();
  },
};
