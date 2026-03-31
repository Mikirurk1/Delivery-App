"use client";

import { forwardRef, useId } from "react";
import clsx from "clsx";
import type { FieldProps } from "@/components/atoms/Field/Field.types";
import styles from "@/components/atoms/Field/Field.module.scss";

function FieldComponent(
  props: FieldProps,
  ref: React.Ref<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  const {
    label,
    error,
    hint,
    classNames = {},
    className,
    as,
    id: idProp,
    children,
    ...rest
  } = props as FieldProps & { options?: unknown };
  const options = (props as FieldProps & { options?: { value: string; label: string; disabled?: boolean }[] }).options;
  const generatedId = useId();
  const isTextarea = as === "textarea";
  const isSelect = as === "select";
  const id =
    idProp ??
    (label ? `field-${label.replace(/\s+/g, "-").toLowerCase()}` : generatedId);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const merged = {
    root: classNames.root,
    label: classNames.label,
    input: classNames.input,
    error: classNames.error,
    hint: classNames.hint,
    text: classNames.text,
  };

  const controlProps = {
    ...rest,
    id,
    ref: ref as React.Ref<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>,
    "aria-invalid": error ? true : undefined,
    "aria-describedby":
      [error && errorId, hint && !error && hintId].filter(Boolean).join(" ") ||
      undefined,
    className: clsx(styles.control, isSelect && styles.select, merged.input, {
      [styles.checkbox]: (rest as { type?: string }).type === "checkbox",
      [styles.number]: (rest as { type?: string }).type === "number",
    }),
  };

  return (
    <div className={clsx(merged.root, className)}>
      {label && (
        <label htmlFor={id} className={clsx(merged.label, merged.text)}>
          <span className={styles.label}>{label}</span>
        </label>
      )}
      {isSelect ? (
        <select {...(controlProps as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>
      ) : isTextarea ? (
        <textarea
          {...(controlProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          {...(controlProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className={clsx(styles.error, merged.error, merged.text)}
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className={clsx(styles.hint, merged.hint, merged.text)}>
          {hint}
        </p>
      )}
    </div>
  );
}

const Field = forwardRef(FieldComponent);
Field.displayName = "Field";

export default Field;
