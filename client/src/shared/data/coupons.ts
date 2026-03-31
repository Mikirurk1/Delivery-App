export type Coupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  categoryName: string;
};

export const COUPONS: Coupon[] = [
  {
    id: "coupon-burgers-10",
    code: "BURGERS10",
    title: "10% off Burgers",
    description: "Discount applies to burger items only.",
    discountPercent: 10,
    categoryName: "Burgers",
  },
  {
    id: "coupon-pizza-15",
    code: "PIZZA15",
    title: "15% off Pizza",
    description: "Discount applies to pizza items only.",
    discountPercent: 15,
    categoryName: "Pizza",
  },
  {
    id: "coupon-dessert-20",
    code: "DESSERT20",
    title: "20% off Desserts",
    description: "Discount applies to dessert items only.",
    discountPercent: 20,
    categoryName: "Desserts",
  },
];
