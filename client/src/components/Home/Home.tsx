import { useVehicles } from "../../api/vehicles.query";
import { VehicleCard } from "../VehicleCard/VehicleCard";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button/Button";
import { Plus } from "lucide-react";
import styles from "./Home.module.css";
import { Drawer } from "../ui/Drawer";
import { AddVehicleForm } from "../AddVehicleForm/AddVehicleForm";

export function Home() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
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
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.headingContainer}>
          <h1 className={styles.heading}>Moje vozidlá</h1>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setDrawerIsOpen(true)}
          >
            <Plus></Plus>
            Pridaj Vozidlo
          </Button>
        </div>

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
      <div>
        <Drawer
          title="Nove vozidlo"
          isOpen={drawerIsOpen}
          onClose={() => setDrawerIsOpen(false)}
          variant="secondary"
        >
          <AddVehicleForm onSuccess={()=> setDrawerIsOpen(false)} />
        </Drawer>
      </div>
    </>
  );
}