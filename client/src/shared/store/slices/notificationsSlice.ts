import { createSlice } from '@reduxjs/toolkit';

export type ToastKind = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  createdAt: number;
  durationMs: number;
}

interface NotificationsState {
  toasts: ToastItem[];
}

const initialState: NotificationsState = {
  toasts: [],
};

function genId() {
  return `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushToast: (
      state,
      action: {
        payload: {
          kind?: ToastKind;
          title: string;
          description?: string;
          durationMs?: number;
          id?: string;
        };
      }
    ) => {
      const { kind = 'info', title, description, durationMs = 3200 } = action.payload;
      const id = action.payload.id ?? genId();
      state.toasts.unshift({
        id,
        kind,
        title,
        description,
        createdAt: Date.now(),
        durationMs,
      });
      // keep small stack
      if (state.toasts.length > 5) state.toasts.length = 5;
    },
    removeToast: (state, action: { payload: string }) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { pushToast, removeToast, clearToasts } = notificationsSlice.actions;
export default notificationsSlice.reducer;

