"use client";
import clsx from "clsx";
import styles from "@/components/organisms/CartSummaryCard/CartSummaryCard.module.scss";

type CartSummaryCardProps = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  activeCouponLabel?: string;
};

export default function CartSummaryCard({
  subtotal,
  discount,
  deliveryFee,
  total,
  activeCouponLabel,
}: CartSummaryCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Order Summary</h3>
      {activeCouponLabel ? (
        <p className={styles.couponActive}>Active coupon: {activeCouponLabel}</p>
      ) : null}
      <div className={styles.line}>
        <span>Subtotal</span>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>
      <div className={styles.line}>
        <span>Discount</span>
        <strong className={styles.discount}>-${discount.toFixed(2)}</strong>
      </div>
      <div className={styles.line}>
        <span>Delivery fee</span>
        <strong>${deliveryFee.toFixed(2)}</strong>
      </div>
      <div className={clsx(styles.line, styles.total)}>
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
