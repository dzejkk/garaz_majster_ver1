import { useVehicleStatus } from "../../api/vehicles.query";
import { useParams, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wrench,
  DollarSign,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import styles from "./VehicleDetail.module.css";

////////////////////////////////////////////////////////////////

export function VehicleDetail() {
  //tahanie vehicleID s useParams
  const { vehicleId } = useParams({ strict: false });

  // Tanstack
  const {
    isLoading,
    isError,
    data: statusData,
  } = useVehicleStatus(vehicleId as string);

  //

  if (isLoading)
    return <div className="p-6 text-gray-400">Načítavam detaily motora...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Chyba pri načítaní detailov.</div>;
  if (!statusData) return null;

  // musi ist az po  ifs
  const { vehicleInfo, stats, serviceIntervals } = statusData;

  // Pomocná funkcia na vykreslenie správnej ikony k statusu servisu
  const getStatusIcon = (status: "OK" | "WARNING" | "CRITICAL") => {
    switch (status) {
      case "OK":
        return <CheckCircle2 size={18} />;
      case "WARNING":
        return <AlertTriangle size={18} />;
      case "CRITICAL":
        return <XCircle size={18} />;
    }
  };

  return (
    // Celý kontajner jemne animujeme pri vstupe na stránku
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Horná navigácia a nadpis */}
      <div className={styles.header}>
        <div>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Späť do garáže
          </Link>
          <h1 className={styles.title}>
            {vehicleInfo.make} {vehicleInfo.model}
          </h1>
          <span className={styles.subtitle}>VIN: {vehicleInfo.vin}</span>
        </div>
      </div>

      {/* Grid s widgetmi (Štatistiky) */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}>
            <Gauge size={24} />
          </div>
          <div>
            <p className={styles.statLabel}>Aktuálny nájazd</p>
            <p className={styles.statValue}>
              {vehicleInfo.currentOdometer.toLocaleString()} km
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapper}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className={styles.statLabel}>Celkové investície</p>
            <p className={styles.statValue}>
              {stats.totalSpent.toLocaleString()} €
            </p>
          </div>
        </div>

        <Link
          to="/vehicles/$vehicleId/service-logs"
          params={{ vehicleId: vehicleId as string }}
          style={{ textDecoration: "none" }}
          className={styles.servisTab}
        >
          <div className={styles.statCard}>
            <div className={styles.iconWrapper}>
              <Wrench size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Počet servisov</p>
              <p className={styles.statValue}>{stats.totalRepairs}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Sekcia: Servisný semafor */}
      <h2 className={styles.sectionTitle}>Stav servisných intervalov</h2>

      <div className={styles.intervalList}>
        {serviceIntervals.map((interval) => (
          <div
            key={interval.id}
            className={`${styles.intervalCard} ${styles[`status_${interval.status}`]}`}
          >
            <div className={styles.intervalInfo}>
              <h4>{interval.title}</h4>
              <p>
                Interval: {interval.intervalKm.toLocaleString()} km | Naposledy
                pri: {interval.lastPerformedOdometer.toLocaleString()} km
              </p>
            </div>

            <div
              className={`${styles.remainingBadge} ${styles[`badge_${interval.status}`]}`}
            >
              {getStatusIcon(interval.status)}
              <span>
                {interval.remainingKm > 0
                  ? `Zostáva ${interval.remainingKm.toLocaleString()} km`
                  : `Zmeškané o ${Math.abs(interval.remainingKm).toLocaleString()} km`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
