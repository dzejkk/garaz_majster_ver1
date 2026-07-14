import { Request, Response } from "express";
import { vehicleModel } from "../models/vehicle.model.js";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      make,
      model,
      year,
      vin,
      engine,
      fuelType,
      enginePowerKw,
      currentOdometer,
      email,
    } = req.body;

    if (!make || !model) {
      res.status(400).json({ error: "znacka a model su povinne" });
      return;
    }

    const user = await vehicleModel.getOrCreateMockUser(
      email || "test@garazmajster.sk",
    );

    const newVehicle = await vehicleModel.create({
      userId: user.id,
      make,
      model,
      year: year ? Number(year) : null,
      vin: vin || null,
      engine: engine || null,
      fuelType: fuelType || null,
      enginePowerKw: enginePowerKw ? Number(enginePowerKw) : null,
      currentOdometer: currentOdometer ? Number(currentOdometer) : 0,
    });

    res.status(201).json({ message: "vozidlo pridane", vehicle: newVehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Interna chyba servera" });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const allVehicles = await vehicleModel.findAll();
    res.json(allVehicles);
  } catch (error) {
    res.status(500).json({ error: "Interná chyba servera" });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vytiahneme z req.body úplne všetko, čo používateľ poslal
    const { userId, id: vehicleId, ...allowedData } = req.body;
    // Trik hore vymaže userId a id z dát, aby ich používateľ nemohol hacknúť/prepísať

    if (!id) {
      res.status(400).json({ error: "ID vozidla je povinné." });
      return;
    }

    // Ošetrenie číselných hodnôt, ak ich používateľ poslal
    if (allowedData.currentOdometer !== undefined)
      allowedData.currentOdometer = Number(allowedData.currentOdometer);
    if (allowedData.enginePowerKw !== undefined)
      allowedData.enginePowerKw = Number(allowedData.enginePowerKw);
    if (allowedData.year !== undefined)
      allowedData.year = Number(allowedData.year);

    //pridame pre zoradovanie
    allowedData.updatedAt = new Date();

    const updatedVehicle = await vehicleModel.update(id as any, allowedData);

    if (!updatedVehicle) {
      res.status(404).json({ error: "Vozidlo sa nenašlo." });
      return;
    }

    res.json({
      message: "Vozidlo bolo úspešne upravené!",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Interná chyba servera" });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID vozidla je povinné." });
      return;
    }

    // Voláme tvoj model, ktorý spraví Drizzle dopyt: db.delete(vehicles).where(eq(vehicles.id, id))
    const deletedVehicle = await vehicleModel.delete(id as string);

    if (!deletedVehicle) {
      res.status(404).json({ error: "Vozidlo sa nenašlo." });
      return;
    }

    res.json({ message: "Vozidlo bolo úspešne zmazané." });
  } catch (error) {
    console.error("Chyba pri mazaní vozidla:", error);
    res.status(500).json({ error: "Interná chyba servera" });
  }
};
