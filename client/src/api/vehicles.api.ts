export interface Vehicle {
  enginePowerKw: number;
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
export interface CreateServiceTaskPayload {
  vehicleId: string;
  title: string;
  intervalKm?: number | null;
  intervalMonths?: number | null;
  lastPerformedOdometer?: number | null;
  lastPerformedDate?: string | null;
}
export interface NewVehiclePayload {
  make: string;
  model: string;
  year?: number | null;
  vin?: string | null;
  engine?: string | null;
  fuelType?: string | null;
  enginePowerKw?: number | null;
  currentOdometer?: number;
}

// používame natívny JS fetch, + Vite proxy pre volanie serveru
export const vehiclesApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await fetch("/api/vehicles");
    if (!response.ok) {
      throw new Error("Nepodarilo sa načítať vozidlá");
    }
    return response.json();
  },

  // GET-funkcia pre car detail
  getCarStatus: async (vehicleId: string): Promise<VehicleStatus> => {
    const response = await fetch(`/api/vehicles/${vehicleId}/status`);

    if (!response.ok) {
      throw new Error("nepodarilo sa nacitat status");
    }
    return response.json();
  },

  // GET -  function pre Servis Detail History
  getCarServiceLogs: async (
    vehicleId: string,
  ): Promise<VehicleServisLogs[]> => {
    const response = await fetch(`/api/service-logs/vehicle/${vehicleId}`);

    if (!response.ok) {
      throw new Error("chyba pri nacitani servis logu");
    }

    return response.json();
  },

  // POST metoda pre  vytvorenie  servis logu
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

  // POST metóda na vytvorenie servisného intervalu

  createServiceInterval: async (
    data: CreateServiceTaskPayload,
  ): Promise<CreateServiceTaskPayload[]> => {
    const response = await fetch("/api/service-tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Tvoj backend vracia { error: "..." }, preto errorData.error
      throw new Error(errorData.error || "Nepodarilo sa vytvoriť interval");
    }

    return response.json() as Promise<CreateServiceTaskPayload[]>;
  },

  // PATCH-aktualizácia odometer

  updateOdometer: async (vehicleId: string, currentOdometer: number) => {
    const response = await fetch(`/api/vehicles/${vehicleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentOdometer }), // ak backend caka objekt musis poslat objekt
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Nepodarilo sa aktualizovat odometer");
    }

    return response.json();
  },

  // POST-Create Vehicle

  createVehicle: async (newVehicleData: NewVehiclePayload) => {
    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newVehicleData), // treba spravit z objektu string ktory vie cestovat po HTTP
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Chyba pri vytvaranim noveho vozidla");
    }

    return response.json();
  },

  // DELETE-one vehicle

  deleteVehicle: async (id: string) => {
    const response = await fetch(`/api/vehicles/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "chyba pri mazani vozidla");
    }

    return response.json();
  },

  // PATCH-update celeho auta

  updateVehicle: async ({
    id,
    ...data
  }: {
    id: string;
    [key: string]: any;
  }) => {
    const response = await fetch(`/api/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Chyba pri uprave vozidla");
    }
    return response.json();
  },
};
