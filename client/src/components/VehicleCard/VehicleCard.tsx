import styles from "./VehicleCard.module.css";
import type { Vehicle } from "../../api/vehicles.api"; // je to typ musíš použiť „type"
import { Link } from "@tanstack/react-router";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      to="/vehicles/$vehicleId"
      params={{ vehicleId: vehicle.id }}
      style={{ textDecoration: "none" }}
    >
      <div className={styles.card}>
        <h3 className={styles.title}>
          {vehicle.make} {vehicle.model}
        </h3>
        <div className={styles.details}>
          <p>Rok: {vehicle.year}</p>
          <p>Nájazd: {vehicle.currentOdometer} km</p>
          <p className={styles.vin}>VIN: {vehicle.vin}</p>
        </div>
        {/* Neskôr sem vložíme vizuálny indikátor statusu (zelená/červená) */}
      </div>
    </Link>
  );
}
