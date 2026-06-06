import express from "express";
// @ts-ignore: cors does not have TypeScript declarations in this project
import cors from "cors";
import dotenv from "dotenv";
import vehicleRoutes from "./routes/vehicle.routes.js";
import serviceLogRoutes from "./routes/serviceLog.routes.js";
import serviceTasksRoutes from "./routes/serviceTask.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Dôležité, aby Express vedel čítať JSON z body requestu

////////////////////////////////////////////////
////////////////////////////////////////////////

// Registrácia našich routov
app.use("/api/vehicles", vehicleRoutes);
// servicesLogs
app.use("/api/service-logs", serviceLogRoutes);
//serviceTasks
app.use("/api/service-tasks", serviceTasksRoutes); // !!!! kebab-case je svetovym standardom pre URL
//vehicle status

////////////////////////////////////////////////
///////////////////////////////////////////////

// Základný health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "GarážMajster API beží" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server beží na http://localhost:${PORT}`);
});
