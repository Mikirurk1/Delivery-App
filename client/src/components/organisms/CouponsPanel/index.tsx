"use client";

import Button from "@/components/atoms/Buttons";
import type { Coupon } from "@/shared/data/coupons";
import styles from "@/components/organisms/CouponsPanel/CouponsPanel.module.scss";

type CouponsPanelProps = {
  coupons: Coupon[];
  activeCouponId: string | null;
  onApplyCoupon: (couponId: string) => void;
  onClearCoupon: () => void;
};

export default function CouponsPanel({
  coupons,
  activeCouponId,
  onApplyCoupon,
  onClearCoupon,
}: CouponsPanelProps) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>Coupons</h3>
        {activeCouponId ? (
          <button type="button" className={styles.clearBtn} onClick={onClearCoupon}>
            Remove active
          </button>
        ) : null}
      </div>
      <p className={styles.note}>Only one coupon can be active at a time.</p>

      <div className={styles.grid}>
        {coupons.map((coupon) => {
          const isActive = coupon.id === activeCouponId;
          return (
            <article key={coupon.id} className={styles.couponCard}>
              <div className={styles.row}>
                <strong>{coupon.code}</strong>
                {isActive ? <span className={styles.badge}>Active</span> : null}
              </div>
              <p className={styles.couponTitle}>{coupon.title}</p>
              <p className={styles.couponDescription}>{coupon.description}</p>
              <p className={styles.category}>
                Category: <strong>{coupon.categoryName}</strong>
              </p>
              <Button
                className={styles.applyBtn}
                disabled={isActive}
                onClick={() => onApplyCoupon(coupon.id)}
              >
                {isActive ? "Applied" : "Apply coupon"}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
