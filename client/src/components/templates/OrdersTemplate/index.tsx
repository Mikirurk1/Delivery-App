"use client";
import clsx from "clsx";
import styles from "@/components/templates/OrdersTemplate/OrdersTemplate.module.scss";

type OrdersTemplateProps = {
  header: React.ReactNode;
  search: React.ReactNode;
  results: React.ReactNode;
};

export default function OrdersTemplate({
  header,
  search,
  results,
}: OrdersTemplateProps) {
  return (
    <section className={clsx(styles.grid, styles.ordersLayout)}>
      {header}
      {search}
      {results}
    </section>
  );
}
