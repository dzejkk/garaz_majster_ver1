import { createFileRoute } from "@tanstack/react-router";
import { VehicleDetail } from "../components/VehicleDetail/VehicleDetail";

export const Route = createFileRoute("/vehicles/$vehicleId/")({
  component: VehicleDetail,
});
