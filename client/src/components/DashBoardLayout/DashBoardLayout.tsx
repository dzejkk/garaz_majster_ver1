import { useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { Menu, Car, Wrench, Settings, RulerDimensionLine } from "lucide-react";
import styles from "./DashboardLayout.module.css";

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMaxWidthSet, setIsMaxWidthSet] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMaxWidth = () => setIsMaxWidthSet(!isMaxWidthSet);

  return (
    <div
      className={styles.layout}
      style={isMaxWidthSet ? { width: "100%" } : { width: " " }}
    >
      {/* Bočný panel */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <div
          className={styles.logo}
          onClick={toggleSidebar}
          style={
            isSidebarOpen
              ? { justifyContent: "space-between" }
              : { justifyContent: "center" }
          }
        >
          {isSidebarOpen ? "Moja Garáž" : "MG"}{" "}
          {isSidebarOpen && (
            <button onClick={toggleSidebar} className={styles.menuBtn}>
              <Menu size={24} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={styles.navItem}
            activeProps={{ className: styles.active }}
          >
            <Car size={24} />
            {isSidebarOpen && <span>Vozidlá</span>}
          </Link>

          {/* Tieto linky zatiaľ nemajú vytvorené routy, sú pripravené do budúcna */}
          <Link to="/" className={styles.navItem}>
            <Wrench size={24} />
            {isSidebarOpen && <span>Servisy</span>}
          </Link>

          <Link to="/" className={styles.navItem}>
            <Settings size={24} />
            {isSidebarOpen && <span>Nastavenia</span>}
          </Link>
        </nav>
      </aside>

      {/* Hlavná časť obrazovky */}
      <div className={styles.mainContent}>
        {/* Vrchná lišta */}
        <header className={styles.header}>
          <div>
            <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              Profil užívateľa
            </span>
          </div>
          {/* max width setup */}
          <div>
            <button onClick={toggleMaxWidth}>
              <RulerDimensionLine strokeWidth={1.2} />
            </button>
          </div>
        </header>

        {/* Sem sa vloží náš Home komponent so zoznamom áut */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
