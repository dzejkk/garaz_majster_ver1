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

router.patch("/:id", updateVehicle);

router.delete("/:id", deleteVehicle);

//hlavná logika výpočtov
router.get("/:vehicleId/status", getVehicleStatusHandler);

export default router;
