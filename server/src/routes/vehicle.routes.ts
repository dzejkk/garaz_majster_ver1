import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  updateVehicle,
} from "../controllers/vehicle.controller.js";
import { getVehicleStatusHandler } from "../controllers/vehicleStatus.controller.js";

const router = Router();

router.post("/", createVehicle);

router.get("/", getVehicles);

router.put("/:id", updateVehicle);

//hlavna logika vypoctov
router.get("/:vehicleId/status", getVehicleStatusHandler);

export default router;
