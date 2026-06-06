import { Request, Response } from "express";
import { vehicleStatusModel } from "../models/vehicleStatus.model.js";

export const getVehicleStatusHandler = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params as { vehicleId: string };

    if (!vehicleId) {
      res.status(400).json({ error: "ID vozidla je povinné v URL." });
      return;
    }

    // Voláme našu novú výpočtovú logiku
    const statusData = await vehicleStatusModel.getVehicleStatus(vehicleId);

    // Posielame kompletne prepočítaný balíček na frontend / do Postmana
    res.json(statusData);
  } catch (error: any) {
    console.error(error);

    // Ak auto neexistuje v DB, naša služba vyhodí Error("Vozidlo nebolo nájdené")
    if (error.message === "Vozidlo nebolo nájdené") {
      res.status(404).json({ error: error.message });
      return;
    }

    res
      .status(500)
      .json({ error: "Interná chyba servera pri výpočte statusu vozidla." });
  }
};
