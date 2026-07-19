import { useForm } from "@tanstack/react-form";
import styles from "./VehicleForm.module.css";
import type { VehicleFormData } from "../../types/vehicle.types.ts";

interface VehicleFormProps {
  onSuccess?: () => void;
  onSubmit?: (data: VehicleFormData) => void;
  isPending: boolean;
  initialData?: (Partial<VehicleFormData> & { id?: string }) | null;
}

export function VehicleForm({
  initialData = null,
  onSubmit,
  isPending,
}: VehicleFormProps) {
  const isEditMode = !!initialData;

  const form = useForm({
    defaultValues: {
      make: initialData?.make ?? "",
      model: initialData?.model ?? "",
      year: initialData?.year ?? "",
      vin: initialData?.vin ?? "",
      engine: initialData?.engine ?? "",
      fuelType: initialData?.fuelType ?? "Benzín",
      enginePowerKw: initialData?.enginePowerKw ?? "",
      currentOdometer: initialData?.currentOdometer ?? "0",
    },

    onSubmit: async ({ value }) => {
      // príprava dat pre odoslanie na backend
      const payload = {
        make: value.make.trim(),
        model: value.model.trim(),
        year: value.year ? Number(value.year) : null,
        vin: value.vin ? value.vin.trim().toUpperCase() : null,
        engine: value.engine ? value.engine.trim() : null,
        fuelType: value.fuelType,
        enginePowerKw: value.enginePowerKw ? Number(value.enginePowerKw) : null,
        currentOdometer: value.currentOdometer
          ? Number(value.currentOdometer)
          : 0,
      };

      if (onSubmit) {
        onSubmit(payload);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className={styles.formContainer}
    >
      {/* start of form layout */}

      <div className={styles.grid}>
        {/* Značka - povinne pole */}
        <form.Field
          name="make"
          validators={{
            onChange: ({ value }) => (!value ? "Znacka je povinna" : undefined),
          }}
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                Znacka *
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.input}
                placeholder="napr. Toyota, Mazda, Skoda"
                type="text"
              />
              {field.state.meta.errors ? (
                <span className={styles.fieldError}>
                  {field.state.meta.errors.join(", ")}
                </span>
              ) : null}
            </div>
          )}
        />

        {/* Model - povinne pole */}
        <form.Field
          name="model"
          validators={{
            onChange: ({ value }) => (!value ? "Model je povinný" : undefined),
          }}
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                Model *
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.input}
                placeholder="napr. Auris, 6, Octavia"
                type="text"
              />
              {field.state.meta.errors ? (
                <span className={styles.fieldError}>
                  {field.state.meta.errors.join(", ")}
                </span>
              ) : null}
            </div>
          )}
        />

        {/* Rok výroby */}
        <form.Field
          name="year"
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                Rok výroby
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.input}
                placeholder="2018"
              />
            </div>
          )}
        />

        {/* VIN */}
        <form.Field
          name="vin"
          validators={{
            onChange: ({ value }) =>
              value && value.length > 17
                ? "VIN môže mať max 17 znakov"
                : undefined,
          }}
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                VIN číslo
              </label>
              <input
                id={field.name}
                name={field.name}
                maxLength={17}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.input}
                placeholder="JT0..."
              />
              {field.state.meta.errors ? (
                <span className={styles.fieldError}>
                  {field.state.meta.errors.join(", ")}
                </span>
              ) : null}
            </div>
          )}
        />

        {/* Motor */}
        <form.Field
          name="engine"
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                Motor / Objem
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.input}
                placeholder="1.8 Hybrid, 2.0 Skyactiv-G"
              />
            </div>
          )}
        />

        {/* Palivo */}
        <form.Field
          name="fuelType"
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                Palivo
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.select}
              >
                <option value="Benzín">Benzín</option>
                <option value="Nafta">Nafta</option>
                <option value="Hybrid">Mild Hybrid</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                <option value="Elektrina">Elektrina</option>
                <option value="LPG">LPG</option>
              </select>
            </div>
          )}
        />

        {/* Výkon kW */}
        <form.Field
          name="enginePowerKw"
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                Výkon (kW)
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.input}
                placeholder="100"
              />
            </div>
          )}
        />

        {/* Počiatočné kilometre */}
        <form.Field
          name="currentOdometer"
          children={(field) => (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field.name}>
                Aktuálne kilometre
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={styles.input}
                placeholder="0"
              />
            </div>
          )}
        />
      </div>

      {/* submit button */}
      <div className={styles.actions}>
        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {isPending
            ? "Ukladám..."
            : isEditMode
              ? "Uložiť zmeny"
              : "Pridať vozidlo"}
        </button>
      </div>
    </form>
  );
}
