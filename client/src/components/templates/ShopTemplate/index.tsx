"use client";
import clsx from "clsx";
import styles from "@/components/templates/ShopTemplate/ShopTemplate.module.scss";

type ShopTemplateProps = {
  header: React.ReactNode;
  filters: React.ReactNode;
  content: React.ReactNode;
};

export default function ShopTemplate({
  header,
  filters,
  content,
}: ShopTemplateProps) {
  return (
    <section className={styles.shopLayout}>
      {header}
      <div className={styles.splitLayout}>
        <aside className={clsx(styles.grid)}>{filters}</aside>
        <main className={clsx(styles.grid)}>{content}</main>
      </div>
    </section>
  );
}
