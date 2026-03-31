"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useMutation } from "@apollo/client/react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { CheckoutForm } from "@/components/organisms/CheckoutForm";
import { CHECKOUT_MUTATION } from "@/shared/graphql/documents";
import { ArrowLeft, CircleCheckBig } from "lucide-react";
import { clearCart, removeItem, setQuantity } from "@/features/cart/cart.slice";
import { clearCheckoutPrefill } from "@/shared/store/slices/checkoutPrefillSlice";
import { clearActiveCoupon, setActiveCoupon } from "@/shared/store/slices/couponSlice";
import CouponsPanel from "@/components/organisms/CouponsPanel";
import { pushToast } from "@/shared/store/slices/notificationsSlice";
import { COUPONS } from "@/shared/data/coupons";
import { useScrollControl } from "@/shared/hooks/useScrollControl";
import CartTemplate from "@/components/templates/CartTemplate";
import CartItemsList from "@/components/organisms/CartItemsList";
import CartSummaryCard from "@/components/organisms/CartSummaryCard";
import StateCard from "@/components/molecules/StateCard";
import { getUiErrorMessage } from "@/shared/errors/uiError";
import { getDiscountAmountForCartItems } from "@/shared/utils/couponPricing";
import { appendLocalOrderHistory } from "@/shared/utils/localOrderHistory";
import styles from "@/app/cart/page.module.scss";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { replaceWithoutScroll } = useScrollControl();
  const pathname = usePathname();
  const items = useAppSelector((state) => state.cart.items);
  const checkoutPrefill = useAppSelector((state) => state.checkoutPrefill.data);
  const activeCouponId = useAppSelector((state) => state.coupon.activeCouponId);
  const [checkout, { loading }] = useMutation(CHECKOUT_MUTATION);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"delivery" | "coupons">(() => {
    if (typeof window === "undefined") return "delivery";
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") === "coupons" ? "coupons" : "delivery";
  });
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
    [items],
  );
  const activeCoupon = useMemo(
    () => COUPONS.find((coupon) => coupon.id === activeCouponId) ?? null,
    [activeCouponId],
  );
  const discount = useMemo(
    () => getDiscountAmountForCartItems(items, activeCoupon),
    [activeCoupon, items],
  );
  const deliveryFee = 4.99;
  const grandTotal = subtotal - discount + deliveryFee;
  const switchTab = (tab: "delivery" | "coupons") => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    if (tab === "coupons") {
      params.set("tab", "coupons");
    } else {
      params.delete("tab");
    }
    const query = params.toString();
    replaceWithoutScroll(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <CartTemplate
      header={
        <div className={styles.pageHead}>
          <Link href="/" className={styles.backToShopsBtn}>
            <span>
              <ArrowLeft size={16} />
            </span>
            <span>Back to Shops</span>
          </Link>
          <h2 className={styles.title}>Shopping Cart</h2>
          <p className={styles.subtitle}>Review your items and complete your order</p>
        </div>
      }
      body={
        <>
          {items.length > 0 ? (
            <div className={styles.twoCol}>
              <CartItemsList
                items={items}
                activeCoupon={activeCoupon}
                onSetQuantity={(productId, quantity) =>
                  dispatch(setQuantity({ productId, quantity }))
                }
                onRemove={(productId) => dispatch(removeItem(productId))}
              />

              <div className={styles.grid}>
                <CartSummaryCard
                  subtotal={subtotal}
                  discount={discount}
                  deliveryFee={deliveryFee}
                  total={grandTotal}
                  activeCouponLabel={activeCoupon?.code}
                />
                <div className={styles.tabSwitch}>
                  <button
                    type="button"
                    className={clsx(styles.tabBtn, {
                      [styles.tabBtnActive]: activeTab === "delivery",
                    })}
                    onClick={() => switchTab("delivery")}
                  >
                    Delivery Details
                  </button>
                  <button
                    type="button"
                    className={clsx(styles.tabBtn, {
                      [styles.tabBtnActive]: activeTab === "coupons",
                    })}
                    onClick={() => switchTab("coupons")}
                  >
                    Coupons
                  </button>
                </div>
                {activeTab === "delivery" ? (
                  <CheckoutForm
                    key={checkoutPrefill?.sourceOrderId ?? "default-checkout-form"}
                    loading={loading}
                    initialValues={
                      checkoutPrefill
                        ? {
                            email: checkoutPrefill.email,
                            phone: checkoutPrefill.phone,
                            address: checkoutPrefill.address,
                          }
                        : undefined
                    }
                    onSubmit={async (values) => {
                      if (!items.length) return;
                      try {
                      const result = (await checkout({
                          variables: {
                            input: {
                              ...values,
                              items: items.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                              })),
                            },
                          },
                      })) as {
                        data?: {
                          checkout?: {
                            id: string;
                            createdAt: string;
                            email: string;
                            phone: string;
                            address: string;
                            total: number;
                            items: {
                              productId: string;
                              productName: string;
                              productPrice: number;
                              quantity: number;
                            }[];
                          };
                        };
                      };
                      if (result.data?.checkout) {
                        appendLocalOrderHistory(result.data.checkout);
                      }
                        dispatch(clearCart());
                        dispatch(clearCheckoutPrefill());
                        dispatch(clearActiveCoupon());
                        const placedOrderId = result.data?.checkout?.id ?? null;
                        setLastPlacedOrderId(placedOrderId);
                        setStatus({
                          tone: "success",
                          message: placedOrderId
                            ? `Order placed successfully. ID: ${placedOrderId}`
                            : "Order placed successfully!",
                        });
                      } catch (error) {
                        const message = getUiErrorMessage(
                          error,
                          "Unable to place the order. Please try again.",
                        )!;
                        dispatch(
                          pushToast({
                            kind: "error",
                            title: "Checkout Error",
                            description: message,
                          }),
                        );
                        setStatus({
                          tone: "error",
                          message,
                        });
                      }
                    }}
                  />
                ) : (
                  <CouponsPanel
                    coupons={COUPONS}
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
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className={clsx(styles.card)}>
              {lastPlacedOrderId ? (
                <StateCard
                  icon={<CircleCheckBig size={44} />}
                  title="Your order has been placed"
                  description={`Order ID: ${lastPlacedOrderId}. You can start a new order by adding items to cart.`}
                />
              ) : (
                <CartItemsList
                  items={items}
                  onSetQuantity={() => undefined}
                  onRemove={() => undefined}
                />
              )}
            </div>
          )}
          {status?.tone === "error" ? (
            <StateCard tone="error" title="Checkout Error" description={status.message} />
          ) : null}
        </>
      }
    />
  );
}
