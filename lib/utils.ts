import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// Utility function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Persian number conversion utilities
const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
export const persianUtils = {
  // Convert English digits to Persian digits
  toPersianDigits: (str: string | number): string => {
    return String(str).replace(/\d/g, (d) => persianDigits[Number(d)]);
  },
  // Format phone number with Persian digits
  formatPhoneNumber: (phone: string): string => {
    return persianUtils.toPersianDigits(phone);
  },
  // Format price with commas and Persian digits
  formatPrice: (price: number): string => {
    const formattedWithCommas = price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return persianUtils.toPersianDigits(formattedWithCommas);
  },
  // Format time unit with leading zero in Persian digits
  formatTimeUnit: (time: number): string => {
    return persianUtils.toPersianDigits(time < 10 ? `0${time}` : time);
  },
};