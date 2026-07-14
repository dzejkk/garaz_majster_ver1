import { motion, AnimatePresence } from "framer-motion";
import styles from "./ConfirmationModal.module.css";
import { Button } from "../Button/Button.tsx";
import { useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isPending?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isPending = false,
}: ConfirmationModalProps) {
  // esc tool
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.backdropOverlay}>
          {/* Pozadie modálu */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Samotné okno modálu */}
          <motion.div
            className={styles.modalBox}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <h3 className={styles.title}>{title}</h3>

            <p className={styles.description}>{description}</p>

            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={isPending}
              >
                Zrušiť
              </Button>

              <Button
                variant={"danger"}
                size="sm"
                onClick={onConfirm}
                disabled={isPending}
              >
                {isPending ? "Mažem..." : "Potvrdiť zmazanie"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
