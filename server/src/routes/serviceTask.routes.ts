import { Router } from "express";
import {
  createServiceTask,
  getVehicleServiceTasks,
} from "../controllers/serviceTask.controller.js";

const router = Router();

router.post("/", createServiceTask);

router.get("/vehicle/:vehicleId", getVehicleServiceTasks);

export default router;
