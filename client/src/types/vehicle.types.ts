// src/types/vehicle.types.ts

// Tento typ reprezentuje presne to, čo odosiela náš formulár
export type VehicleFormData = {
  make: string;
  model: string;
  year: number | null;
  vin: string | null;
  engine: string | null;
  fuelType: string;
  enginePowerKw: number | null;
  currentOdometer: number;
};

// Tento typ reprezentuje auto tak, ako ho vracia databáza/API (má aj ID, dátumy...)
export type Vehicle = VehicleFormData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
