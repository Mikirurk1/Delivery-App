"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  removeToast,
  type ToastKind,
} from "@/shared/store/slices/notificationsSlice";
import styles from "@/components/atoms/ToastViewport/Notifications.module.scss";

function ToastIcon({ kind }: { kind: ToastKind }) {
  if (kind === "success") return <CheckCircle2 size={16} />;
  if (kind === "warning") return <TriangleAlert size={16} />;
  if (kind === "error") return <AlertCircle size={16} />;
  return <Info size={16} />;
}

function toastKindClass(kind: ToastKind) {
  if (kind === "success") return styles.kindSuccess;
  if (kind === "warning") return styles.kindWarning;
  if (kind === "error") return styles.kindError;
  return styles.kindInfo;
}

export function ToastViewport() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.notifications.toasts);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(
        () => dispatch(removeToast(toast.id)),
        toast.durationMs,
      ),
    );
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [dispatch, toasts]);

  if (toasts.length === 0) return null;

  return (
    <div
      className={styles.viewport}
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(styles.toastCard, toastKindClass(toast.kind))}
          role="status"
        >
          <div className={styles.iconWrap} aria-hidden>
            <ToastIcon kind={toast.kind} />
          </div>
          <div className={styles.content}>
            <div className={styles.titleRow}>
              <div className={styles.title}>{toast.title}</div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => dispatch(removeToast(toast.id))}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
            {toast.description ? (
              <div className={styles.description}>{toast.description}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
