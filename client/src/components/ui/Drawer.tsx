import { motion, AnimatePresence } from "framer-motion";
import styles from "./Drawer.module.css";
import cx from "clsx";

type DrawerVariant = "primary" | "secondary";
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: DrawerVariant;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  variant = "primary",
}: DrawerProps) {
  const drawerStyle = cx(styles.drawer, styles[variant]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Tmavé pozadie (Backdrop) - kliknutím mimo sa Drawer zatvorí */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Samotný vysúvací panel */}
          <motion.div
            className={drawerStyle}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2>{title}</h2>
              <button onClick={onClose} className={styles.closeBtn}>
                &times;
              </button>
            </div>

            <div className={styles.content}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
