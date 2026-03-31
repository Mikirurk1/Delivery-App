"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import type { AppLinkProps } from "@/components/atoms/Link/Link.types";

function scrollToHashId(href: string) {
  const id = href.startsWith("#") ? href.slice(1) : null;
  if (!id) return;
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
  if (typeof window !== "undefined" && window.history.replaceState) {
    window.history.replaceState(null, "", href);
  }
}

export default function AppLink({
  href,
  target,
  className,
  children,
  startIcon,
  endIcon,
  classNames = {},
  style,
  active = false,
  onClick,
  ...rest
}: AppLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isHashLink =
    typeof href === "string" && href.startsWith("#") && href.length > 1;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHashLink) {
      e.preventDefault();
      scrollToHashId(href);
    }
    onClick?.(e);
  };

  const merged = {
    root: clsx(classNames.root ?? ""),
    startIcon: clsx(classNames.startIcon || "startIcon"),
    text: clsx(classNames.text || "text"),
    endIcon: clsx(classNames.endIcon || "endIcon"),
  };

  return (
    <Link
      href={href}
      target={target}
      className={clsx(merged.root, className, active && "-active")}
      style={style}
      onClick={handleClick}
      {...rest}
    >
      {startIcon && (
        <span className={merged.startIcon} style={{ display: "inherit" }}>
          {startIcon}
        </span>
      )}
      {children && <span className={merged.text}>{children}</span>}
      {endIcon && (
        <span className={merged.endIcon} style={{ display: "inherit" }}>
          {endIcon}
        </span>
      )}
    </Link>
  );
}
