import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function stripHtml(html: string) {
  if (typeof window === "undefined" || !html) return html || "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  } catch (e) {
    return html.replace(/<[^>]*>/g, "");
  }
}

export function parseDate(date: any) {
  if (!date) return new Date(0);
  const num = Number(date);
  if (!isNaN(num) && num !== 0) {
    // If it's less than 10^12, it's probably seconds (Unix timestamp)
    return num < 10000000000 ? new Date(num * 1000) : new Date(num);
  }
  return new Date(date);
}
