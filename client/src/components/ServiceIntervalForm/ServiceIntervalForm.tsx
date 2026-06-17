import { useState } from "react";
import { useCreateServiceInterval } from "../../api/vehicles.query";

export const ServiceIntervalForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    intervalKm: 0,
    intervalMonths: 0,
    lastPerformedOdometer: 0,
    lastPerformedDate: "",
  });
};
// pouzijeme tanstack FORM
