import { useDeleteVehicle, useVehicleStatus } from "../../api/vehicles.query";
import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import cx from "clsx";
import {
  ArrowLeft,
  Wrench,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import styles from "./VehicleDetail.module.css";
import { Button } from "../ui/Button/Button";
import { Drawer } from "../ui/Drawer";
import { useState } from "react";
import { ServiceIntervalForm } from "../ServiceIntervalForm/ServiceIntervalForm";
import { EditableOdometer } from "./EditableOdometer";

////////////////////////////////////////////////////////////////

export function VehicleDetail() {
  const navigate = useNavigate();
  const [activateDrawer, setActivateDrawer] = useState(false);
  const { mutate: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();

  //ťahanie vehicleID s useParams
  const { vehicleId } = useParams({ strict: false });
  const {
    isLoading,
    isError,
    data: statusData,
  } = useVehicleStatus(vehicleId as string);
  //
  if (isLoading) return <div>Načítavam detaily motora...</div>;
  if (isError) return <div>Chyba pri načítaní detailov.</div>;
  if (!statusData) return null;

  // musí ist az po if
  const { vehicleInfo, stats, serviceIntervals } = statusData;

  //HANDLER DELETE
  const handleDeleteVehicle = () => {
    const isConfirmed = window.confirm(
      `Naozaj chcete vymazať vozidlo ${vehicleInfo.make} ${vehicleInfo.model} ? tato akcia je nezvratná a zmaže všetky údaje o vozidle`,
    );

    if (isConfirmed) {
      // voláme mutáciu

      deleteVehicle(vehicleId as string, {
        onSuccess: () => {
          navigate({to: "/"});
        },
      });
    }
  };

  // Pomocná funkcia na vykreslenie správnej ikony k statusu servisu
  const getStatusIcon = (status: "OK" | "WARNING" | "DUE") => {
    switch (status) {
      case "OK":
        return <CheckCircle2 size={18} />;
      case "WARNING":
        return <AlertTriangle size={18} />;
      case "DUE":
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
        {/* DELETE VEHICLE */}
        <div>
          <Button
            size="sm"
            variant="danger"
            onClick={handleDeleteVehicle}
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      {/* Grid s widget (Štatistiky) */}
      <div className={styles.statsGrid}>
        <EditableOdometer
          vehicleId={vehicleId as string}
          currentOdometer={vehicleInfo.currentOdometer}
        />

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

      <hr
        style={{
          border: "none",
          height: "1px",
          background: "#374151",
          marginBlockEnd: "2rem",
        }}
      />

      {/* sekcia: Servisný semafor */}

      <div className={styles.flex_between_util}>
        <h2 className={styles.sectionTitle}>Stav servisných intervalov</h2>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setActivateDrawer(true)}
        >
          <PlusCircle strokeWidth={1.5} />
          Pridaj servisny interval
        </Button>
      </div>

      <div className={styles.intervalList}>
        {serviceIntervals.map((interval) => (
          <div
            key={interval.id}
            className={cx(
              styles.intervalCard,
              styles[`status_${interval.status}`],
            )}
          >
            <div className={styles.intervalInfo}>
              <h4>{interval.title}</h4>
              <p>
                Interval: {interval.intervalKm?.toLocaleString()} km | Naposledy
                pri: {interval.lastPerformedOdometer?.toLocaleString()} km
              </p>
              <p>
                Interval : {interval.intervalMonths} mesiacov | Naposledy
                vykonane: {interval.lastPerformedDate}
              </p>
            </div>

            <div
              className={`${styles.remainingBadge} ${styles[`badge_${interval.status}`]}`}
            >
              {getStatusIcon(interval.status)}
              <span>
                {interval.remainingKm > 0
                  ? `Zostáva ${interval.remainingKm?.toLocaleString()} km alebo ${interval.remainingDays} dni`
                  : `Zmeškané o ${Math.abs(interval.remainingKm).toLocaleString()} km a ${interval.remainingDays} dni`}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <Drawer
        isOpen={activateDrawer}
        onClose={() => setActivateDrawer(false)}
        title="Novy servisny interval"
      >
        <ServiceIntervalForm
          vehicleId={vehicleId as string}
          onClose={() => setActivateDrawer(false)}
        />
      </Drawer>
    </motion.div>
  );
}
