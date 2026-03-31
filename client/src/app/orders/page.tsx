"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { ORDERS_QUERY, REORDER_MUTATION } from "@/shared/graphql/documents";
import Field from "@/components/atoms/Field";
import Button from "@/components/atoms/Buttons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/store/hooks";
import { mergeItems } from "@/features/cart/cart.slice";
import { setCheckoutPrefill } from "@/shared/store/slices/checkoutPrefillSlice";
import { pushToast } from "@/shared/store/slices/notificationsSlice";
import OrdersTemplate from "@/components/templates/OrdersTemplate";
import OrderResultsList from "@/components/organisms/OrderResultsList";
import { getUiErrorMessage } from "@/shared/errors/uiError";
import {
  formatEmailInput,
  formatOrderIdInput,
  formatPhoneInput,
} from "@/shared/utils/inputFormatters";
import { readLocalOrderHistory } from "@/shared/utils/localOrderHistory";
import { ArrowLeft, Search } from "lucide-react";
import styles from "@/app/orders/page.module.scss";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [localOrderHistory, setLocalOrderHistory] = useState<
    {
      id: string;
      createdAt: string;
      email: string;
      phone: string;
      address: string;
      total: number;
      items: { productName: string; productPrice: number; quantity: number }[];
    }[]
  >([]);
  const [searchType, setSearchType] = useState<"contact" | "orderId">("contact");
  const [searched, setSearched] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);
  const [loadOrders, { data, loading, error }] = useLazyQuery(ORDERS_QUERY);
  const [reorder] = useMutation(REORDER_MUTATION);

  const orders = ((data as { orders?: unknown[] } | undefined)?.orders ??
    []) as {
    id: string;
    createdAt: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: { productName: string; productPrice: number; quantity: number }[];
  }[];

  const ordersErrorMessage = getUiErrorMessage(
    error,
    "Unable to search orders. Please try again.",
  );

  useEffect(() => {
    if (!ordersErrorMessage) return;
    dispatch(
      pushToast({
        kind: "error",
        title: "Order Search Error",
        description: ordersErrorMessage,
      }),
    );
  }, [dispatch, ordersErrorMessage]);

  useEffect(() => {
    setLocalOrderHistory(readLocalOrderHistory());
  }, []);

  return (
    <OrdersTemplate
      header={
        <div className={styles.pageHead}>
          <Link href="/" className={styles.backToShopsBtn}>
            <span>
              <ArrowLeft size={16} />
            </span>
            <span>Back to Shops</span>
          </Link>
          <h2 className={styles.title}>Order History</h2>
          <p className={styles.subtitle}>Search for your past orders</p>
        </div>
      }
      search={
        <div className={clsx(styles.searchCard)}>
          <div className={styles.chipSwitch}>
            <button
              type="button"
              className={clsx(styles.chipBtn, styles.ordersTabBtn, {
                [styles.chipBtnActive]: searchType === "contact",
              })}
              onClick={() => {
                setSearchType("contact");
                setSearched(false);
              }}
            >
              Search by Email/Phone
            </button>
            <button
              type="button"
              className={clsx(styles.chipBtn, styles.ordersTabBtn, {
                [styles.chipBtnActive]: searchType === "orderId",
              })}
              onClick={() => {
                setSearchType("orderId");
                setSearched(false);
              }}
            >
              Search by Order ID
            </button>
          </div>
          {searchType === "contact" ? (
            <>
              <Field
                label="Email"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(formatEmailInput(e.target.value))}
              />
              <div className={styles.muted}>OR</div>
              <Field
                label="Phone"
                placeholder="+44 20 7946 0958"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
              />
            </>
          ) : (
            <Field
              label="Order ID"
              placeholder="507f1f77bcf86cd799439011"
              maxLength={24}
              value={orderId}
              onChange={(e) => setOrderId(formatOrderIdInput(e.target.value))}
            />
          )}
          <Button
            className={styles.searchBtn}
            onClick={() => {
              setSearched(true);
              loadOrders({
                variables: {
                  email: searchType === "contact" ? email || undefined : undefined,
                  phone: searchType === "contact" ? phone || undefined : undefined,
                  orderId: searchType === "orderId" ? orderId || undefined : undefined,
                },
              });
            }}
          >
            <Search size={16} />
            Search Orders
          </Button>
        </div>
      }
      results={
        <>
          <OrderResultsList
            loading={loading}
            searched={searched}
            orders={orders}
            errorMessage={ordersErrorMessage}
            reorderingOrderId={reorderingOrderId}
            onReorder={async (order) => {
              if (reorderingOrderId) return;
              setReorderingOrderId(order.id);
              try {
                const result = (await reorder({
                  variables: { orderId: order.id },
                })) as {
                  data?: {
                    reorder?: {
                      items?: {
                        productId: string;
                        productName: string;
                        productPrice: number;
                        quantity: number;
                      }[];
                    };
                  };
                };
                const reorderItems = result.data?.reorder?.items ?? [];
                if (reorderItems.length === 0) {
                  dispatch(
                    pushToast({
                      kind: "warning",
                      title: "No items to reorder",
                      description: "This order has no items to add to your cart.",
                    }),
                  );
                  return;
                }

                dispatch(mergeItems(reorderItems));
                dispatch(
                  pushToast({
                    kind: "success",
                    title: "Items added to cart",
                    description: `${reorderItems.length} item(s) from order #${order.id} were added.`,
                  }),
                );
                dispatch(
                  setCheckoutPrefill({
                    email: order.email,
                    phone: order.phone,
                    address: order.address,
                    sourceOrderId: order.id,
                  }),
                );
                router.push("/cart");
              } catch (mutationError) {
                dispatch(
                  pushToast({
                    kind: "error",
                    title: "Reorder Error",
                    description: getUiErrorMessage(
                      mutationError,
                      "Unable to add items from this order.",
                    ),
                  }),
                );
              } finally {
                setReorderingOrderId(null);
              }
            }}
          />
          {localOrderHistory.length > 0 ? (
            <section className={styles.prefillHistory}>
              <h3 className={styles.prefillHistoryTitle}>Your local order history</h3>
              <OrderResultsList
                loading={false}
                searched
                orders={localOrderHistory}
                onReorder={async (order) => {
                  if (reorderingOrderId) return;
                  setReorderingOrderId(order.id);
                  try {
                    const result = (await reorder({
                      variables: { orderId: order.id },
                    })) as {
                      data?: {
                        reorder?: {
                          items?: {
                            productId: string;
                            productName: string;
                            productPrice: number;
                            quantity: number;
                          }[];
                        };
                      };
                    };
                    const reorderItems = result.data?.reorder?.items ?? [];
                    if (reorderItems.length === 0) {
                      dispatch(
                        pushToast({
                          kind: "warning",
                          title: "No items to reorder",
                          description: "This order has no items to add to your cart.",
                        }),
                      );
                      return;
                    }

                    dispatch(mergeItems(reorderItems));
                    dispatch(
                      setCheckoutPrefill({
                        email: order.email,
                        phone: order.phone,
                        address: order.address,
                        sourceOrderId: order.id,
                      }),
                    );
                    router.push("/cart");
                  } catch (mutationError) {
                    dispatch(
                      pushToast({
                        kind: "error",
                        title: "Reorder Error",
                        description: getUiErrorMessage(
                          mutationError,
                          "Unable to add items from this order.",
                        ),
                      }),
                    );
                  } finally {
                    setReorderingOrderId(null);
                  }
                }}
              />
            </section>
          ) : null}
        </>
      }
    />
  );
}
