import {
  useVehicleServisHistory,
  useVehicleStatus,
} from "../../api/vehicles.query";
import type { VehicleServisLogs } from "../../api/vehicles.api";
import styles from "./VehiclesServisLogs.module.css";
import { useParams } from "@tanstack/react-router";
import { Drawer } from "../ui/Drawer";
import { useState } from "react";
import { ServiceLogForm } from "../ServiceLogForm/ServiceLogForm";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function VehicleServisLogs() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { vehicleId } = useParams({ strict: false });
  const {
    data: logs,
    isLoading,
    isError,
  } = useVehicleServisHistory(vehicleId as string);

  const { data: vehicleStatus } = useVehicleStatus(vehicleId as string);

  if (isLoading)
    return (
      <div className={styles.container}>Načítavam servisnú históriu...</div>
    );
  if (isError)
    return (
      <div className={styles.container} style={{ color: "#ef4444" }}>
        Chyba pri načítaní záznamov.
      </div>
    );

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to="/vehicles/$vehicleId"
        params={{ vehicleId: vehicleId as string }}
        className={styles.backLink}
        style={{ textDecoration: "none" }}
      >
        <ArrowLeft size={16} /> Spat na Detail vozidla
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Servisná história vozidla</h1>
        <button className={styles.btn} onClick={() => setIsDrawerOpen(true)}>
          + Zapísať nový servis
        </button>
      </div>

      {logs && logs.length === 0 ? (
        <p className={styles.noLogs}>
          Toto vozidlo nemá zatiaľ žiadne servisné záznamy.
        </p>
      ) : (
        <div className={styles.list}>
          <AnimatePresence initial={false}>
            {logs?.map((log: VehicleServisLogs) => (
              <motion.div
                key={log.id}
                layout // Toto zabezpečí, že ostatné karty sa plynule posunú dole
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.logTitle}>{log.title}</h3>
                    <p className={styles.logDesc}>{log.description}</p>
                  </div>
                  <div className={styles.cardRight}>
                    <span className={styles.cost}>{log.cost} €</span>
                    <p className={styles.date}>
                      {new Date(log.serviceDate).toLocaleDateString("sk-SK")}
                    </p>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span>Stav tachometra pri servise:</span>
                  <span className={styles.odometer}>
                    {log.odometerAtService.toLocaleString()} km
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* drawer */}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Novy servisny zaznam"
      >
        <ServiceLogForm
          vehicleId={vehicleId as string}
          serviceIntervals={vehicleStatus?.serviceIntervals as []}
          onClose={() => setIsDrawerOpen(false)}
        />
      </Drawer>
    </motion.div>
  );
}
