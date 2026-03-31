"use client";

import clsx from "clsx";
import type { ButtonProps } from "@/components/atoms/Buttons/Button.types";
import styles from "@/components/atoms/Buttons/Button.module.scss";

export default function Button({
  onClick,
  children,
  startIcon,
  endIcon,
  active = false,
  classNames = {},
  style,
  className,
  ...rest
}: ButtonProps) {
  const handleClick = () => {
    if (!onClick) return;
    if (Array.isArray(onClick)) {
      onClick.forEach((fn) => fn());
    } else if (typeof onClick === "function") {
      onClick();
    }
  };

  const merged = {
    root: classNames.root,
    startIcon: classNames.startIcon,
    text: classNames.text,
    endIcon: classNames.endIcon,
    active: classNames.active,
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(styles.button, merged.root, className, {
        [merged.active!]: active,
      })}
      style={style}
      {...rest}
    >
      {startIcon && (
        <span
          className={clsx("startIcon", merged.startIcon)}
          style={{ display: "inherit" }}
        >
          {startIcon}
        </span>
      )}
      {children && (
        <span className={clsx("text", merged.text)}>{children}</span>
      )}
      {endIcon && (
        <span
          className={clsx("endIcon", merged.endIcon)}
          style={{ display: "inherit" }}
        >
          {endIcon}
        </span>
      )}
    </button>
  );
}
