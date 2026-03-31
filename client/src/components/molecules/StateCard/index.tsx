"use client";
import clsx from "clsx";
import styles from "@/components/molecules/StateCard/StateCard.module.scss";

type StateCardProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  tone?: "default" | "error";
};

export default function StateCard({
  icon,
  title,
  description,
  tone = "default",
}: StateCardProps) {
  return (
    <div className={clsx(styles.card, tone === "error" && styles.error)}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
