import React, { useState } from "react";
import { useCreateServiceLog } from "../../api/vehicles.query";
import styles from "../ServiceLogForm/ServiceLogForm.module.css";

///
///
///

interface ServiceLogFormElements {
  vehicleId: string;
  serviceIntervals?: ServiceInterval[];
  onClose: () => void;
}

interface ServiceInterval {
  id: string;
  title: string;
}

///
///
///

export function ServiceLogForm({
  vehicleId,
  serviceIntervals = [],
  onClose,
}: ServiceLogFormElements) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    serviceDate: new Date().toISOString().split("T")[0],
    odometerAtService: "",
    serviceTaskId: "",
  });

  const mutation = useCreateServiceLog(vehicleId);

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    mutation.mutate(
      {
        ...formData,
        vehicleId,
        cost: Number(formData.cost),
        odometerAtService: Number(formData.odometerAtService),
        serviceTaskId: formData.serviceTaskId || null,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Názov úkonu *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="napr. Výmena oleja 5W-30"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Naviazať na plánovaný interval (voliteľné)</label>
        <select
          value={formData.serviceTaskId}
          onChange={(e) =>
            setFormData({ ...formData, serviceTaskId: e.target.value })
          }
        >
          <option value="">-- Žiadny (iba zápis do histórie) --</option>
          {serviceIntervals.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label>Cena (€) *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Stav tachometra (km) *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.odometerAtService}
            onChange={(e) =>
              setFormData({ ...formData, odometerAtService: e.target.value })
            }
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Dátum servisu *</label>
        <input
          type="date"
          required
          value={formData.serviceDate}
          onChange={(e) =>
            setFormData({ ...formData, serviceDate: e.target.value })
          }
        />
      </div>

      <div className={styles.formGroup}>
        <label>Popis / Poznámka</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.btnCancel} onClick={onClose}>
          Zrušiť
        </button>
        <button
          type="submit"
          className={styles.btnSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Ukladám..." : "Uložiť servis"}
        </button>
      </div>
    </form>
  );
}
