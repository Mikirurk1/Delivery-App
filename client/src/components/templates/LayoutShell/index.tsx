"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { hydrateCart } from "@/features/cart/cart.slice";
import AppHeader from "@/components/organisms/AppHeader";
import AppFooter from "@/components/organisms/AppFooter";
import WelcomeModal from "@/components/organisms/WelcomeModal";
import styles from "@/components/templates/LayoutShell/LayoutShell.module.scss";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const mounted = useSyncExternalStore(
    (onStoreChange) => {
      const timer = window.setTimeout(onStoreChange, 0);
      return () => window.clearTimeout(timer);
    },
    () => true,
    () => false,
  );
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          productId: string;
          productName: string;
          productPrice: number;
          quantity: number;
        }[];
        dispatch(hydrateCart(parsed));
      } catch {
        localStorage.removeItem("cart");
      }
    }

    if (localStorage.getItem("hasSeenWelcomeGuide")) return;
    const timer = window.setTimeout(() => setWelcomeOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items, mounted]);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const closeWelcome = () => {
    localStorage.setItem("hasSeenWelcomeGuide", "true");
    setWelcomeOpen(false);
  };

  return (
    <div className={styles.appShell}>
      <AppHeader mounted={mounted} cartItemCount={cartItemCount} />

      <main className={clsx(styles.container, styles.pageMain)}>{children}</main>
      <AppFooter />
      <WelcomeModal open={mounted && welcomeOpen} onClose={closeWelcome} />
    </div>
  );
}
