import type { Coupon } from "@/shared/data/coupons";

export function isCouponApplicable(
  coupon: Coupon | null | undefined,
  categoryName: string | undefined,
) {
  if (!coupon || !categoryName) return false;
  return categoryName.toLowerCase() === coupon.categoryName.toLowerCase();
}

export function getDiscountedPrice(
  price: number,
  categoryName: string | undefined,
  coupon: Coupon | null | undefined,
) {
  if (!isCouponApplicable(coupon, categoryName)) return price;
  const discountPercent = coupon?.discountPercent ?? 0;
  return price * (1 - discountPercent / 100);
}

export function getDiscountAmountForCartItems(
  items: {
    productPrice: number;
    quantity: number;
    categoryName?: string;
  }[],
  coupon: Coupon | null | undefined,
) {
  if (!coupon) return 0;
  return items.reduce((sum, item) => {
    if (!isCouponApplicable(coupon, item.categoryName)) return sum;
    return sum + (item.productPrice * item.quantity * coupon.discountPercent) / 100;
  }, 0);
}
