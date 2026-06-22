import { useForm } from "@tanstack/react-form";
import { useCreateServiceInterval } from "../../api/vehicles.query";
import { Button } from "../ui/Button/Button";
import { Plus, X } from "lucide-react";
import styles from "./ServiceIntervalForm.module.css";

interface ServiceIntervalFormProps {
  vehicleId: string;
  onClose: () => void;
}

export function ServiceIntervalForm({
  vehicleId,
  onClose,
}: ServiceIntervalFormProps) {
  const mutation = useCreateServiceInterval(vehicleId);

  // 1. Inicializácia TanStack Form
  const form = useForm({
    defaultValues: {
      title: "",
      intervalKm: "",
      intervalMonths: "",
      lastPerformedOdometer: "",
      lastPerformedDate: "",
    },
    onSubmit: async ({ value }) => {
      // Zavolá sa iba vtedy, ak prejdú všetky validácie
      mutation.mutate(
        {
          title: value.title,
          intervalKm: value.intervalKm ? Number(value.intervalKm) : null,
          intervalMonths: value.intervalMonths
            ? Number(value.intervalMonths)
            : null,
          lastPerformedOdometer: value.lastPerformedOdometer
            ? Number(value.lastPerformedOdometer)
            : null,
          lastPerformedDate: value.lastPerformedDate || null,
        },
        {
          onSuccess: () => onClose(),
        },
      );
    },
  });

  return (
    // form.handleSubmit musíme obaliť do natívneho onSubmitu
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={styles.form}
    >
      {/* NÁZOV (Povinné pole s validáciou) */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => (!value ? "Názov je povinný" : undefined),
        }}
        children={(field) => (
          <div className={styles.field}>
            <label htmlFor={field.name}>Názov údržby *</label>
            <input
              id={field.name}
              type="text"
              placeholder="napr. Výmena motorového oleja"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <span className={styles.error}>
                {field.state.meta.errors.join(", ")}
              </span>
            )}
          </div>
        )}
      />

      <div className={styles.row}>
        {/* INTERVAL KM */}
        <form.Field
          name="intervalKm"
          children={(field) => (
            <div className={styles.field}>
              <label htmlFor={field.name}>Interval (km)</label>
              <input
                id={field.name}
                type="number"
                placeholder="napr. 15000"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        {/* INTERVAL MESIACE */}
        <form.Field
          name="intervalMonths"
          children={(field) => (
            <div className={styles.field}>
              <label htmlFor={field.name}>Interval (mesiace)</label>
              <input
                id={field.name}
                type="number"
                placeholder="napr. 12"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>

      <hr className={styles.divider} />
      <h4 className={styles.sectionTitle}>Naposledy vykonané (voliteľné)</h4>

      <div className={styles.row}>
        {/* ODOMETER */}
        <form.Field
          name="lastPerformedOdometer"
          children={(field) => (
            <div className={styles.field}>
              <label htmlFor={field.name}>Stav tachometra (km)</label>
              <input
                id={field.name}
                type="number"
                placeholder="napr. 142000"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        {/* DÁTUM */}
        <form.Field
          name="lastPerformedDate"
          children={(field) => (
            <div className={styles.field}>
              <label htmlFor={field.name}>Dátum vykonania</label>
              <input
                id={field.name}
                type="date"
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>

      {mutation.isError && (
        <div className={styles.globalError}>
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Chyba pri ukladaní"}
        </div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          <X size={16} />
          Zrušiť
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={mutation.isPending}
        >
          <Plus size={16} />
          Vytvoriť plán
        </Button>
      </div>
    </form>
  );
}
