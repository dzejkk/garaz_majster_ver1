import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";
import cx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

// 2. Rozšírime štandardné HTML atribúty tlačidla o naše vlastné props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Poskladáme CSS triedy dynamicky na základe props
  const buttonClass = cx(
    styles.btn,
    styles[variant],
    styles[size],
    { [styles.loading]: isLoading },
    className,
  );

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading} // Ak ukladá, automaticky ho disabluje
      {...props} // Sem padnú veci ako onClick, type="submit", atď.
    >
      {isLoading ? (
        <span className={styles.spinnerWrapper}>
          <span className={styles.spinner} />
          Nacitavam...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
