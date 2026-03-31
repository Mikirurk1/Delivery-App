"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, TicketPercent } from "lucide-react";
import Field from "@/components/atoms/Field";
import CouponsPanel from "@/components/organisms/CouponsPanel";
import StateCard from "@/components/molecules/StateCard";
import { COUPONS } from "@/shared/data/coupons";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { clearActiveCoupon, setActiveCoupon } from "@/shared/store/slices/couponSlice";
import { pushToast } from "@/shared/store/slices/notificationsSlice";
import styles from "@/app/coupons/page.module.scss";

export default function CouponsPage() {
  const dispatch = useAppDispatch();
  const activeCouponId = useAppSelector((state) => state.coupon.activeCouponId);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minDiscountFilter, setMinDiscountFilter] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(COUPONS.map((coupon) => coupon.categoryName))),
    [],
  );

  const filteredCoupons = useMemo(() => {
    return COUPONS.filter((coupon) => {
      const byQuery = query
        ? coupon.code.toLowerCase().includes(query.toLowerCase()) ||
          coupon.title.toLowerCase().includes(query.toLowerCase())
        : true;
      const byCategory = categoryFilter
        ? coupon.categoryName.toLowerCase() === categoryFilter.toLowerCase()
        : true;
      const byDiscount = minDiscountFilter
        ? coupon.discountPercent >= Number(minDiscountFilter)
        : true;
      return byQuery && byCategory && byDiscount;
    });
  }, [categoryFilter, minDiscountFilter, query]);

  return (
    <section className={styles.grid}>
      <div className={styles.pageHead}>
        <Link href="/" className={styles.backToShopsBtn}>
          <span>
            <ArrowLeft size={16} />
          </span>
          <span>Back to Shops</span>
        </Link>
        <h2 className={styles.title}>Coupons</h2>
        <p className={styles.subtitle}>Apply one active coupon for eligible product categories.</p>
      </div>

      <div className={styles.filtersCard}>
        <div className={styles.filtersHead}>
          <TicketPercent size={18} />
          <strong>Filters</strong>
        </div>
        <div className={styles.filtersGrid}>
          <Field
            label="Search"
            placeholder="Code or title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Field
            as="select"
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "", label: "All categories" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
          />
          <Field
            as="select"
            label="Minimum discount"
            value={minDiscountFilter}
            onChange={(e) => setMinDiscountFilter(e.target.value)}
            options={[
              { value: "", label: "Any" },
              { value: "10", label: "10%+" },
              { value: "15", label: "15%+" },
              { value: "20", label: "20%+" },
            ]}
          />
        </div>
      </div>

      {filteredCoupons.length > 0 ? (
        <CouponsPanel
          coupons={filteredCoupons}
          activeCouponId={activeCouponId}
          onApplyCoupon={(couponId) => {
            const coupon = COUPONS.find((item) => item.id === couponId);
            dispatch(setActiveCoupon(couponId));
            if (!coupon) return;
            dispatch(
              pushToast({
                kind: "success",
                title: "Coupon applied",
                description: `${coupon.code} is now active.`,
              }),
            );
          }}
          onClearCoupon={() => {
            dispatch(clearActiveCoupon());
            dispatch(
              pushToast({
                kind: "info",
                title: "Coupon removed",
                description: "No active coupon is currently selected.",
              }),
            );
          }}
        />
      ) : (
        <div className={clsx(styles.card)}>
          <StateCard
            title="No coupons found"
            description="Try changing filters to see available coupons."
          />
        </div>
      )}
    </section>
  );
}
