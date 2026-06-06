import { Router } from "express";
import {
  createServiceLog,
  getVehicleServiceLogs,
} from "../controllers/serviceLog.controller.js";

const router = Router();

router.post("/", createServiceLog);

router.get("/vehicle/:vehicleId", getVehicleServiceLogs);

export default router;
