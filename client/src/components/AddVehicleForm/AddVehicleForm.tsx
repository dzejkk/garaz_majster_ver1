import { useForm } from "@tanstack/react-form";
import { useCreateVehicle } from "../../api/vehicles.query";
import styles from "./AddVehicleForm.module.css";

export function AddVehicleForm({ onSuccess }) {
  const { mutate: createVehicle, isPending, error } = useCreateVehicle();

  const form = useForm({
    defaultValues: {
      make: "",
      model: "",
      year: "",
      vin: "",
      engine: "",
      fuelType: "Benzín",
      enginePowerKw: "",
      currentOdometer: "0",
    },

    onSubmit: async ({ value }) => {
      // priprava dat pre  odoslanie na backend
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

      createVehicle(payload, {
        onSuccess: () => {
          form.reset();
          if (onSuccess) onSuccess();
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={styles.formContainer}
    >
      {error && <div className={styles.errorMessage}>{error.message}</div>}

      {/* start of form layout */}

      <div className={styles.grid}>
        {/* Znacka - povinne pole */}

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
      </div>

      {/* submit button */}
      <div className={styles.actions}>
        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {isPending ? "Ukladám..." : "Pridať vozidlo"}
        </button>
      </div>
    </form>
  );
}
