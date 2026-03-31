import { AsYouType } from "libphonenumber-js";

export function formatEmailInput(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

export function formatOrderIdInput(value: string) {
  return value.toLowerCase().replace(/[^a-f0-9]/g, "").slice(0, 24);
}

export function formatPhoneInput(value: string) {
  const allowedChars = value.replace(/[^\d+]/g, "");
  if (!allowedChars) return "";

  const normalized = allowedChars.startsWith("+")
    ? `+${allowedChars.slice(1).replace(/\+/g, "")}`
    : allowedChars.replace(/\+/g, "");

  const truncated = normalized.startsWith("+")
    ? `+${normalized.slice(1, 16)}`
    : normalized.slice(0, 15);

  return new AsYouType().input(truncated);
}

export function formatAddressInput(value: string) {
  return value
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/, "")
    .slice(0, 200);
}
