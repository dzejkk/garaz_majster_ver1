import { createFileRoute } from "@tanstack/react-router";
import { VehicleServisLogs } from "../components/VehicleServisLogs/VehicleServisLogs";

export const Route = createFileRoute("/vehicles/$vehicleId/service-logs")({
  component: VehicleServisLogs,
});
