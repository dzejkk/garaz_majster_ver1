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
  Pencil,
} from "lucide-react";
import styles from "./VehicleDetail.module.css";
import { Button } from "../ui/Button/Button";
import { Drawer } from "../ui/Drawer";
import { useState } from "react";
import { ServiceIntervalForm } from "../ServiceIntervalForm/ServiceIntervalForm";
import { EditableOdometer } from "./EditableOdometer";
import { ConfirmationModal } from "../ui/ConfirmationModal/ConfirmationModal.tsx";
import { VehicleForm } from "../AddVehicleForm/VehicleForm.tsx";
import {
  useDeleteVehicle,
  useUpdateVehicle,
  useVehicleStatus,
} from "../../api/vehicles.query.ts";

export function VehicleDetail() {
  const navigate = useNavigate();
  const { vehicleId } = useParams({ strict: false });
  const [activateDrawer, setActivateDrawer] = useState(false);
  const [activateEditDrawer, setActivateEditDrawer] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();
  const { mutate: editVehicle, isPending: editVehiclePending } =
    useUpdateVehicle(vehicleId as string);

  //ťahanie vehicleID s useParams
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
    deleteVehicle(vehicleId as string, {
      onSuccess: () => {
        void navigate({ to: "/" });
      },
    });
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
          <span className={styles.subtitle}>
            kW: {vehicleInfo.enginePowerKw}
          </span>
        </div>
        {/* edit vehicle / delete vehicle*/}
        <div>
          {/*  UPDATE VEHICLE*/}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActivateEditDrawer(true)}
          >
            <Pencil size={18} />
          </Button>
          {/* DELETE VEHICLE */}
          <Button
            size="sm"
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
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

      {/* ============== UI COMPONENETY ===========================*/}
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

      {/*edit vehicle drawer*/}

      <Drawer
        title="Uprava udajov o vozidle"
        isOpen={activateEditDrawer}
        onClose={() => setActivateEditDrawer(false)}
        variant="secondary"
      >
        <VehicleForm
          initialData={vehicleInfo}
          onSubmit={(formData) => {
            editVehicle(
              { id: vehicleId as string, ...formData },
              {
                onSuccess: () => {
                  setActivateEditDrawer(false);
                },
              },
            );
          }}
          isPending={editVehiclePending}
        />
      </Drawer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteVehicle}
        isPending={isDeleting}
        title="Zmazat vozidlo ?"
        description={`Naozaj chcete zmazať vozidlo ${vehicleInfo.make} ${vehicleInfo.model} ${vehicleInfo.vin} ?`}
      />
    </motion.div>
  );
}
