import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: string;
  productName: string;
  productPrice: number;
  categoryId?: string;
  categoryName?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addItem(
      state,
      action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>,
    ) {
      const quantity = action.payload.quantity ?? 1;
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (existing) {
        existing.quantity += quantity;
        return;
      }
      state.items.push({
        productId: action.payload.productId,
        productName: action.payload.productName,
        productPrice: action.payload.productPrice,
        categoryId: action.payload.categoryId,
        categoryName: action.payload.categoryName,
        quantity,
      });
    },
    setQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      state.items = state.items
        .map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    mergeItems(state, action: PayloadAction<CartItem[]>) {
      action.payload.forEach((incoming) => {
        const existing = state.items.find(
          (item) => item.productId === incoming.productId,
        );
        if (existing) {
          existing.quantity += incoming.quantity;
          return;
        }
        state.items.push(incoming);
      });
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addItem,
  setQuantity,
  removeItem,
  mergeItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
