"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { History, ShoppingBag, ShoppingCart, TicketPercent } from "lucide-react";
import styles from "@/components/organisms/AppHeader/AppHeader.module.scss";

type AppHeaderProps = {
  mounted: boolean;
  cartItemCount: number;
};

const navItems = [
  { href: "/", label: "Shops", Icon: ShoppingBag },
  { href: "/cart", label: "Cart", Icon: ShoppingCart },
  { href: "/coupons", label: "Coupons", Icon: TicketPercent },
  { href: "/orders", label: "Orders", Icon: History },
] as const;

export default function AppHeader({ mounted, cartItemCount }: AppHeaderProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/shops";
    return pathname === href;
  };

  return (
    <header className={styles.topbar}>
      <div className={clsx(styles.container, styles.topbarInner)}>
        <Link href="/" className={styles.brandLink}>
          <span className={styles.brandIcon}>
            <ShoppingBag size={18} />
          </span>
          <span>Delivery App</span>
        </Link>
        <nav className={styles.nav}>
          {navItems.map(({ href, label, Icon }) => {
            const isActive = isActiveRoute(href);
            const badge = href === "/cart" ? cartItemCount : 0;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(styles.navLink, {
                  [styles.navLinkActive]: isActive,
                })}
              >
                <Icon size={18} />
                <span>{label}</span>
                {mounted && badge > 0 ? <span className={styles.navBadge}>{badge}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={styles.mobileNav}>
        {navItems.map(({ href, label, Icon }) => {
          const isActive = isActiveRoute(href);
          const badge = href === "/cart" ? cartItemCount : 0;
          return (
            <Link
              key={`mobile-${href}`}
              href={href}
              className={clsx(styles.navLink, {
                [styles.navLinkActive]: isActive,
              })}
            >
              <span className={styles.mobileNavIconWrap}>
                <Icon size={22} />
                {mounted && badge > 0 ? (
                  <span className={clsx(styles.navBadge, styles.mobileBadge)}>{badge}</span>
                ) : null}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
