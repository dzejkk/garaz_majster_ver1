import { useVehicles } from "../../api/vehicles.query";
import { VehicleCard } from "../VehicleCard/VehicleCard";
import { motion } from "framer-motion";
import styles from "./Home.module.css";

export function Home() {
  // TanStack Query //
  const { isLoading, isError, data: vehicles } = useVehicles();
  ////////////////////

  if (isLoading)
    return <div className={styles.message}>Načítavam garáž...</div>;
  if (isError)
    return (
      <div className={styles.message}>
        Chyba pri načítaní dát. Skontroluj bežiaci backend.
      </div>
    );

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className={styles.heading}>Moje vozidlá</h1>

      {vehicles?.length === 0 ? (
        <p className={styles.message}>Garáž je zatiaľ prázdna.</p>
      ) : (
        <div className={styles.grid}>
          {vehicles?.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
