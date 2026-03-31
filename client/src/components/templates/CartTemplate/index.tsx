"use client";
import clsx from "clsx";
import styles from "@/components/templates/CartTemplate/CartTemplate.module.scss";

type CartTemplateProps = {
  header: React.ReactNode;
  body: React.ReactNode;
};

export default function CartTemplate({ header, body }: CartTemplateProps) {
  return (
    <section className={clsx(styles.grid)}>
      {header}
      {body}
    </section>
  );
}
