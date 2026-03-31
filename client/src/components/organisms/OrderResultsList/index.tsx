"use client";

import Button from "@/components/atoms/Buttons";
import { OrderCardSkeleton } from "@/components/atoms/Skeleton";
import StateCard from "@/components/molecules/StateCard";
import clsx from "clsx";
import {
  Calendar,
  CircleAlert,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShoppingBag,
} from "lucide-react";
import styles from "@/components/organisms/OrderResultsList/OrderResultsList.module.scss";

type OrderItem = {
  productName: string;
  productPrice: number;
  quantity: number;
};

type Order = {
  id: string;
  createdAt: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: OrderItem[];
};

type OrderResultsListProps = {
  loading: boolean;
  searched: boolean;
  orders: Order[];
  errorMessage?: string;
  reorderingOrderId?: string | null;
  onReorder: (order: Order) => void;
};

export default function OrderResultsList({
  loading,
  searched,
  orders,
  errorMessage,
  reorderingOrderId,
  onReorder,
}: OrderResultsListProps) {
  if (loading) {
    return (
      <div className={clsx(styles.grid, styles.delayedReveal)}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <OrderCardSkeleton key={`order-skeleton-${idx}`} />
        ))}
      </div>
    );
  }
  if (!searched) {
    return (
      <StateCard
        icon={<Search size={44} />}
        title="Search for your orders"
        description="Enter your contact information or order ID above to view your order history."
      />
    );
  }
  if (errorMessage) {
    return (
      <StateCard
        icon={<CircleAlert size={44} />}
        title="Search error"
        description={errorMessage}
        tone="error"
      />
    );
  }
  if (orders.length === 0) {
    return (
      <StateCard
        icon={<ClipboardList size={44} />}
        title="No orders found"
        description="We couldn't find any orders matching your search. Please check your details and try again."
      />
    );
  }

  return (
    <>
      <p className={styles.muted}>
        Found {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>
      <h3 className={styles.historyTitle}>Completed orders history</h3>
      {orders.map((order) => (
        <article key={order.id} className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h4>Order #{order.id}</h4>
              <p className={styles.date}>
                <Calendar size={14} /> {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span className={styles.statusBadge}>completed</span>
          </div>
          <dl className={styles.metaGrid}>
            <div className={styles.metaRow}>
              <dt className={styles.metaLabel}>
                <Mail size={14} />
                Email
              </dt>
              <dd className={styles.metaValue}>{order.email}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className={styles.metaLabel}>
                <Phone size={14} />
                Phone
              </dt>
              <dd className={styles.metaValue}>{order.phone}</dd>
            </div>
            <div className={styles.metaRowWide}>
              <dt className={styles.metaLabel}>
                <MapPin size={14} />
                Address
              </dt>
              <dd className={styles.metaValue}>{order.address}</dd>
            </div>
          </dl>
          <ul className={styles.items}>
            {order.items.map((item, idx) => (
              <li key={`${order.id}-${idx}`} className={styles.item}>
                <span className={styles.itemLabel}>
                  <ShoppingBag size={14} /> {item.quantity}x {item.productName}
                </span>
                <span className={styles.muted}>${(item.productPrice * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.cardFoot}>
            <div>
              <p className={styles.muted}>Total</p>
              <p className={styles.total}>${order.total.toFixed(2)}</p>
            </div>
            <Button
              className={styles.reorderBtn}
              onClick={() => onReorder(order)}
              disabled={Boolean(reorderingOrderId)}
            >
              <RotateCcw size={14} />{" "}
              {reorderingOrderId === order.id ? "Reordering..." : "Reorder"}
            </Button>
          </div>
        </article>
      ))}
    </>
  );
}
