import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";
import { getVehicleStatusHandler } from "../controllers/vehicleStatus.controller.js";

const router = Router();

router.post("/", createVehicle);

router.get("/", getVehicles);

router.put("/:id", updateVehicle);

router.delete("/:id", deleteVehicle);

//hlavna logika vypoctov
router.get("/:vehicleId/status", getVehicleStatusHandler);

export default router;
