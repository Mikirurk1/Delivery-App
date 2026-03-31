import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FiltersState = {
  selectedShopId: string;
  sortBy: string;
  categoryIds: string[];
  ratingRange: string;
  page: number;
};

const initialState: FiltersState = {
  selectedShopId: "",
  sortBy: "NAME_ASC",
  categoryIds: [],
  ratingRange: "",
  page: 1,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedShopId(state, action: PayloadAction<string>) {
      state.selectedShopId = action.payload;
      state.page = 1;
    },
    setSortBy(state, action: PayloadAction<string>) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setCategoryIds(state, action: PayloadAction<string[]>) {
      state.categoryIds = action.payload;
      state.page = 1;
    },
    setRatingRange(state, action: PayloadAction<string>) {
      state.ratingRange = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters(state) {
      state.selectedShopId = "";
      state.sortBy = "NAME_ASC";
      state.categoryIds = [];
      state.ratingRange = "";
      state.page = 1;
    },
  },
});

export const {
  setSelectedShopId,
  setSortBy,
  setCategoryIds,
  setRatingRange,
  setPage,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
