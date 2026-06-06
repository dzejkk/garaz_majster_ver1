import { Request, Response } from "express";
import { serviceLogModel } from "../models/serviceLog.model.js";

export const createServiceLog = async (req: Request, res: Response) => {
  try {
    const {
      vehicleId,
      title,
      description,
      odometerAtService,
      serviceDate,
      cost,
    } = req.body;

    if (!vehicleId || !title || !odometerAtService || !serviceDate) {
      res.status(400).json({
        error:
          "Chýbajú povinné údaje (vehicleId, title, odometerAtService, serviceDate).",
      });
      return;
    }

    const newLog = await serviceLogModel.create({
      vehicleId,
      title,
      description: description || null,
      odometerAtService: Number(odometerAtService),
      serviceDate,
      cost: cost ? Number(cost) : null,
    });

    res
      .status(201)
      .json({ message: "Servisný záznam bol pridaný!", log: newLog });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Interná chyby servera pri pridávaní servisu" });
  }
};

export const getVehicleServiceLogs = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params as { vehicleId: string }; // treba tsku povedat co to je za typ

    if (!vehicleId) {
      res.status(400).json({ error: "ID vozidla je povinné." });
      return;
    }

    const logs = await serviceLogModel.findByVehicleId(vehicleId);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Interná chyba servera pri ťahaní servisu" });
  }
};
