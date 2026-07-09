import { useState } from "react";
import { Gauge, Pencil, Check, X } from "lucide-react";
import { useUpdateOdometer } from "../../api/vehicles.query";
import styles from "./VehicleDetail.module.css"; // zdioelame rovnake styly

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
      alert("Zadaj platne cislo odometra");
      return;
    }

    updateOdometer(numValue, {
      onSuccess: () => setIsEditing(false),
    });
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.iconWrapper}>
        <Gauge size={24} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <p className={styles.statLabel}>Aktuálny nájazd</p>

        {isEditing ? (
          <div
            style={{
              display: "flex",
              gap: "6px",
              alignItems: "center",
              marginTop: "4px",
            }}
          >
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isPending}
              autoFocus
              style={{
                width: "100px",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleSave}
              disabled={isPending}
              style={{
                color: "green",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setInputValue(currentOdometer.toString());
              }}
              disabled={isPending}
              style={{
                color: "red",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <p className={styles.statValue}>
              {currentOdometer.toLocaleString()} km
            </p>
            <button
              onClick={handleStartEditing}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                opacity: 0.5,
                padding: 0,
                color: "white",
              }}
              title="Upraviť kilometre"
            >
              <Pencil size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
