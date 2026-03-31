import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CheckoutPrefill = {
  email: string;
  phone: string;
  address: string;
  sourceOrderId?: string;
};

type CheckoutPrefillState = {
  data: CheckoutPrefill | null;
};

const initialState: CheckoutPrefillState = {
  data: null,
};

const checkoutPrefillSlice = createSlice({
  name: "checkoutPrefill",
  initialState,
  reducers: {
    setCheckoutPrefill(state, action: PayloadAction<CheckoutPrefill>) {
      state.data = action.payload;
    },
    clearCheckoutPrefill(state) {
      state.data = null;
    },
  },
});

export const { setCheckoutPrefill, clearCheckoutPrefill } =
  checkoutPrefillSlice.actions;
export default checkoutPrefillSlice.reducer;
