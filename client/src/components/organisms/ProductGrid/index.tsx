"use client";

import { ProductCard } from "@/components/molecules/ProductCard";
import StateCard from "@/components/molecules/StateCard";
import clsx from "clsx";
import type { Coupon } from "@/shared/data/coupons";
import { getDiscountedPrice, isCouponApplicable } from "@/shared/utils/couponPricing";
import styles from "@/components/organisms/ProductGrid/ProductGrid.module.scss";

type ProductGridItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  category: { id: string; name: string };
};

type ProductGridProps = {
  items: ProductGridItem[];
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  activeCoupon?: Coupon | null;
  onAdd: (item: ProductGridItem) => void;
};

export default function ProductGrid({
  items,
  loading,
  error,
  errorMessage,
  activeCoupon,
  onAdd,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={clsx(styles.grid, styles.delayedReveal)}>
        {Array.from({ length: 9 }).map((_, idx) => (
          <ProductCard
            key={`product-skeleton-${idx}`}
            id={`product-skeleton-${idx}`}
            name=""
            price={0}
            categoryName=""
            onAdd={() => undefined}
            loading
          />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <StateCard
        tone="error"
        title="Failed to load products"
        description={errorMessage ?? "Please refresh the page and try again."}
      />
    );
  }
  if (items.length === 0) {
    return (
      <StateCard
        title="No products found"
        description="Try adjusting your filters or search for different items."
      />
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={getDiscountedPrice(product.price, product.category.name, activeCoupon)}
          originalPrice={
            isCouponApplicable(activeCoupon, product.category.name)
              ? product.price
              : undefined
          }
          discountPercent={
            isCouponApplicable(activeCoupon, product.category.name)
              ? activeCoupon?.discountPercent
              : undefined
          }
          imageUrl={product.imageUrl}
          categoryName={product.category.name}
          onAdd={() => onAdd(product)}
        />
      ))}
    </div>
  );
}
