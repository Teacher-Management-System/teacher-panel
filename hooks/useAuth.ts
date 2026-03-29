"use client";

import { useAuthContext } from "@/context/auth-context";

export function useAuth() {
  const context = useAuthContext();
  return context;
}
