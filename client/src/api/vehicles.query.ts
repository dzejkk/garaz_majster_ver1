import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "./vehicles.api";
import type { CreateServiceLogPayload } from "./vehicles.api";

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

//  MUTACIA
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
