import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cart.slice";
import filtersReducer from "@/features/filters/filters.slice";
import notificationsReducer from "@/shared/store/slices/notificationsSlice";
import checkoutPrefillReducer from "@/shared/store/slices/checkoutPrefillSlice";
import couponReducer from "@/shared/store/slices/couponSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filters: filtersReducer,
    notifications: notificationsReducer,
    checkoutPrefill: checkoutPrefillReducer,
    coupon: couponReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
