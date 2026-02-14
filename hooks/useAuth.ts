"use client";

import { useState, useEffect, useCallback } from "react";
import { User, UserStatus } from "@/types/user";
import { cookieService } from "@/lib/cookie";
import profileService from "@/features/profile/api.service";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  status: UserStatus | null;
  isActive: boolean;
  isPendingOrInactive: boolean;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const authToken = cookieService.getCookie("authToken");
      if (!authToken) {
        setIsLoading(false);
        return;
      }
      const response = await profileService.getProfile();
      if (response?.user) {
        setUser(response.user as User);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await fetchUser();
  }, [fetchUser]);

  const status = user?.status || null;
  const isActive = status === "active";
  const isPendingOrInactive = status === "pending" || status === "inactive";

  return {
    user,
    isLoading,
    status,
    isActive,
    isPendingOrInactive,
    refreshUser,
  };
}
