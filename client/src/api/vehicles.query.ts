import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "./vehicles.api";
import type {
  CreateServiceLogPayload,
  CreateServiceTaskPayload,
} from "./vehicles.api";

// TENTO JEDEN RIADOK VYRIEŠI DUPLICITU:
// Vyrobí nový typ tak, že z API payloadu vyhodí "vehicleId"
type ServiceIntervalFormData = Omit<CreateServiceTaskPayload, "vehicleId">;

// get all cars info

export const useVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: vehiclesApi.getAll,
  });
};

// get status of the car
export const useVehicleStatus = (vehicleId: string) => {
  return useQuery({
    queryKey: ["vehicleStatus", vehicleId],
    queryFn: () => vehiclesApi.getCarStatus(vehicleId),
    enabled: !!vehicleId,
  });
};

// get servis log
export const useVehicleServisHistory = (vehicleId: string) => {
  return useQuery({
    queryKey: ["vehicleServiceLogs", vehicleId],
    queryFn: () => vehiclesApi.getCarServiceLogs(vehicleId),
    enabled: !!vehicleId,
  });
};

//  MUTACIE
export function useCreateServiceLog(vehicleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceLogPayload) =>
      vehiclesApi.createCarServiceLogs(data),
    onSuccess: () => {
      //toto refreshe cache a stiahne aktualne data a zmaze stare

      queryClient.invalidateQueries({
        queryKey: ["vehicleServiceLogs", vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ["vehicleStatus", vehicleId] });
    },
  });
}

export function useCreateServiceInterval(vehicleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: ServiceIntervalFormData) =>
      vehiclesApi.createServiceInterval({
        vehicleId, // Pridáme ID auta
        ...formData, // Dosypeme zvyšok dát z formulára
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleStatus", vehicleId] });
    },
  });
}

export function useUpdateOdometer(vehicleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currentOdometer: number) =>
      vehiclesApi.updateOdometer(vehicleId, currentOdometer),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleStatus", vehicleId] });
    },
    onError: (error) => {
      console.error("CHyba pri aktualizacii odometra", error);
      alert("nepodarilo s aktualizovat odometer");
    },
  });
}

// vytvorenie_noveho_vozdila

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehiclesApi.createVehicle,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (error) => {
      console.error("CHyba pri vytvarani vozidla", error);
      alert(error.message);
    },
  });
}

// zmazanie vozidla

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehiclesApi.deleteVehicle,
    onSuccess: () => {
      // Zoznam sa okamžite prečíta znova a zmazané auto zmizne z obrazovky
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (error: Error) => {
      console.error("Chyba pri mazaní:", error);
      alert(error.message);
    },
  });
}

// update vozidla

export function useUpdateVehicle(vehicleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehiclesApi.updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      //
      queryClient.invalidateQueries({ queryKey: ["vehicleStatus", vehicleId] });
    },
  });
}
