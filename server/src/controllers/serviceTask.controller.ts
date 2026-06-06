import { Request, Response } from "express";
import { serviceTaskModel } from "../models/serviceTask.model.js";

export const createServiceTask = async (req: Request, res: Response) => {
  try {
    const {
      vehicleId,
      title,
      intervalKm,
      intervalMonths,
      lastPerformedOdometer,
      lastPerformedDate,
    } = req.body;

    if (!vehicleId || !title) {
      res.status(400).json({ error: "vehicleId a title sú povinné polia." });
      return;
    }

    const newTask = await serviceTaskModel.create({
      vehicleId,
      title,
      intervalKm: intervalKm ? Number(intervalKm) : null,
      intervalMonths: intervalMonths ? Number(intervalMonths) : null,
      lastPerformedOdometer: lastPerformedOdometer
        ? Number(lastPerformedOdometer)
        : null,
      lastPerformedDate: lastPerformedDate || null,
    });

    res.status(201).json({
      message: "Servisny interval bol uspesne vytvoreny",
      task: newTask,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "interna chyba servera pri vytvarani ulohy" });
  }
};

export const getVehicleServiceTasks = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params as { vehicleId: string };

    if (!vehicleId) {
      res.status(400).json({ error: "Id vozidla je povinne" });
      return;
    }

    const allServiceTasks = await serviceTaskModel.findByVehicleId(vehicleId);
    res.json(allServiceTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Interna chyba servera" });
  }
};
