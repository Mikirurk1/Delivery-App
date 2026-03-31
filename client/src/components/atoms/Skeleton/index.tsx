"use client";
import clsx from "clsx";
import styles from "@/components/atoms/Skeleton/Skeleton.module.scss";

export function OrderCardSkeleton() {
  return (
    <article className={styles.card}>
      <div className={styles.orderCardHead}>
        <div className={styles.grid}>
          <div className={clsx(styles.skeleton, styles.textLg)} />
          <div className={clsx(styles.skeleton, styles.textSm)} />
        </div>
        <div className={clsx(styles.skeleton, styles.chip)} />
      </div>
      <div className={styles.orderItems}>
        <div className={clsx(styles.skeleton, styles.text)} />
        <div className={clsx(styles.skeleton, styles.text)} />
        <div className={clsx(styles.skeleton, styles.textSm)} />
      </div>
      <div className={styles.orderCardFoot}>
        <div className={styles.grid}>
          <div className={clsx(styles.skeleton, styles.textSm)} />
          <div className={clsx(styles.skeleton, styles.price)} />
        </div>
        <div className={clsx(styles.skeleton, styles.button)} />
      </div>
    </article>
  );
}
