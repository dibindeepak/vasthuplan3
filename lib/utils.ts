import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let counter = 1000;
export function generateUniqueId(prefix = 'el'): string {
  counter += 1;
  const countStr = counter.toString(36);
  return `${prefix}-${countStr}`;
}
