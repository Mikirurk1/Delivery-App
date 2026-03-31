"use client";

import clsx from "clsx";
import Button from "@/components/atoms/Buttons";
import StateCard from "@/components/molecules/StateCard";
import type { Coupon } from "@/shared/data/coupons";
import { getDiscountedPrice, isCouponApplicable } from "@/shared/utils/couponPricing";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import styles from "@/components/organisms/CartItemsList/CartItemsList.module.scss";

type CartItem = {
  productId: string;
  productName: string;
  productPrice: number;
  categoryName?: string;
  quantity: number;
};

type CartItemsListProps = {
  items: CartItem[];
  activeCoupon?: Coupon | null;
  onSetQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export default function CartItemsList({
  items,
  activeCoupon,
  onSetQuantity,
  onRemove,
}: CartItemsListProps) {
  if (items.length === 0) {
    return (
      <StateCard
        icon={<ShoppingCart size={44} />}
        title="Your cart is empty"
        description="Add some delicious items to your cart to get started."
      />
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <article
          key={item.productId}
          className={clsx(styles.row, {
            [styles.rowDiscounted]: isCouponApplicable(activeCoupon, item.categoryName),
          })}
        >
          <div className={styles.main}>
            <h4>{item.productName}</h4>
            <p className={styles.muted}>Food item</p>
            <div className={styles.unitPriceWrap}>
              {isCouponApplicable(activeCoupon, item.categoryName) ? (
                <>
                  <p className={styles.unitPriceOriginal}>${item.productPrice.toFixed(2)} each</p>
                  <p className={styles.unitPrice}>
                    ${getDiscountedPrice(item.productPrice, item.categoryName, activeCoupon).toFixed(2)} each
                  </p>
                </>
              ) : (
                <p className={styles.unitPrice}>${item.productPrice.toFixed(2)} each</p>
              )}
            </div>
          </div>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onSetQuantity(item.productId, Math.max(1, item.quantity - 1))}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <input
              className={styles.quantityInput}
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                onSetQuantity(item.productId, Math.max(1, Number(e.target.value) || 1))
              }
            />
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={() => onSetQuantity(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className={styles.actions}>
            <p className={styles.total}>
              $
              {(
                getDiscountedPrice(item.productPrice, item.categoryName, activeCoupon) *
                item.quantity
              ).toFixed(2)}
            </p>
            <Button
              className={styles.removeBtn}
              onClick={() => onRemove(item.productId)}
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
