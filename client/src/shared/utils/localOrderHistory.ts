export type LocalOrderHistoryItem = {
  id: string;
  createdAt: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: {
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
  }[];
};

const ORDER_HISTORY_STORAGE_KEY = "delivery_order_history";

export function readLocalOrderHistory(): LocalOrderHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalOrderHistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function appendLocalOrderHistory(order: LocalOrderHistoryItem) {
  if (typeof window === "undefined") return;
  const history = readLocalOrderHistory();
  const withoutDuplicate = history.filter((item) => item.id !== order.id);
  const nextHistory = [order, ...withoutDuplicate].slice(0, 50);
  window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
}
