import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Taked from https://www.geeksforgeeks.org/what-is-the-javascript-version-of-sleep-method/
export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
