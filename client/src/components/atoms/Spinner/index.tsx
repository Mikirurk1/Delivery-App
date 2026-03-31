"use client";
import styles from "@/components/atoms/Spinner/Spinner.module.scss";

type SpinnerProps = {
  label?: string;
};

export default function Spinner({ label = "Loading..." }: SpinnerProps) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}
