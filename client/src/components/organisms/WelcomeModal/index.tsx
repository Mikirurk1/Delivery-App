"use client";

import { Package, Search, ShoppingBag, ShoppingCart, X } from "lucide-react";
import clsx from "clsx";
import styles from "@/components/organisms/WelcomeModal/WelcomeModal.module.scss";

type WelcomeModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <button className={styles.close} onClick={onClose} aria-label="Close welcome popup">
          <X size={18} />
        </button>
        <div className={styles.head}>
          <div className={styles.logo}>
            <ShoppingBag size={20} />
          </div>
          <h3>Welcome to Delivery App! 🎉</h3>
          <p>Your complete food delivery experience starts here</p>
        </div>
        <div className={styles.points}>
          <div className={styles.point}>
            <div className={clsx(styles.pointIcon, styles.primary)}>
              <ShoppingBag size={16} />
            </div>
            <div>
              <h4>Browse & Filter</h4>
              <p>Explore restaurants, filter by category, rating, and sort by price or name</p>
            </div>
          </div>
          <div className={styles.point}>
            <div className={clsx(styles.pointIcon, styles.teal)}>
              <ShoppingCart size={16} />
            </div>
            <div>
              <h4>Add to Cart</h4>
              <p>Select your favorite items, adjust quantities, and proceed to checkout</p>
            </div>
          </div>
          <div className={styles.point}>
            <div className={clsx(styles.pointIcon, styles.green)}>
              <Search size={16} />
            </div>
            <div>
              <h4>Track Orders</h4>
              <p>Search your order history by email, phone, or order ID and reorder with one click</p>
            </div>
          </div>
          <div className={styles.point}>
            <div className={clsx(styles.pointIcon, styles.amber)}>
              <Package size={16} />
            </div>
            <div>
              <h4>Design System</h4>
              <p>Check out the complete component library in the footer link</p>
            </div>
          </div>
        </div>
        <button className={styles.button} onClick={onClose}>
          Get Started
        </button>
      </div>
    </div>
  );
}
