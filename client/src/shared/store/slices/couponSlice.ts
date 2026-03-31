import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CouponState = {
  activeCouponId: string | null;
};

const initialState: CouponState = {
  activeCouponId: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setActiveCoupon(state, action: PayloadAction<string>) {
      state.activeCouponId = action.payload;
    },
    clearActiveCoupon(state) {
      state.activeCouponId = null;
    },
  },
});

export const { setActiveCoupon, clearActiveCoupon } = couponSlice.actions;
export default couponSlice.reducer;
