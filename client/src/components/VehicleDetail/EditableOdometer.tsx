import { useState } from "react";
import { Gauge, Pencil, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateOdometer } from "../../api/vehicles.query";
import styles from "./VehicleDetail.module.css";
import cx from "clsx";

interface EditableOdometerProps {
  vehicleId: string;
  currentOdometer: number;
}

export function EditableOdometer({
  vehicleId,
  currentOdometer,
}: EditableOdometerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { mutate: updateOdometer, isPending } = useUpdateOdometer(vehicleId);

  const handleStartEditing = () => {
    setInputValue(currentOdometer.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const numValue = Number(inputValue);
    if (isNaN(numValue) || numValue < 0) {
      alert("Zadaj platné číslo kilometrov");
      return;
    }

    updateOdometer(numValue, {
      onSuccess: () => setIsEditing(false),
    });
  };

  // Varianty pre Framer Motion animácie
  const animationVariants = {
    initial: { opacity: 0, y: 0 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.iconWrapper}>
        <Gauge size={24} />
      </div>

      <div className={styles.odometerContent}>
        <p className={styles.statLabel}>Aktuálny nájazd</p>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className={styles.editContainer}
            >
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isPending}
                autoFocus
                className={styles.editInput}
              />
              <div
                style={{
                  display: "flex",
                  borderRadius: "4px",
                  gap: "4px",
                  transform: "translate(6px)",
                }}
              >
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className={cx(styles.iconBtn, styles.saveBtn)}
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isPending}
                  className={cx(styles.iconBtn, styles.cancelBtn)}
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className={styles.viewContainer}
            >
              <p className={styles.statValue}>
                {currentOdometer.toLocaleString()} km
              </p>
              <button
                onClick={handleStartEditing}
                className={cx(styles.iconBtn, styles.editBtn)}
                title="Upraviť kilometre"
              >
                <Pencil size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
