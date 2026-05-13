"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, UserStatus } from "@/types/user";
import { cookieService } from "@/lib/cookie";
import profileService from "@/features/profile/aou.service";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  status: UserStatus | null;
  isActive: boolean;
  isPending: boolean;
  isPendingOrInactive: boolean;
  isProfileCompleted: boolean;
  isBasicCompleted: boolean;
  isAddressCompleted: boolean;
  isDocumentCompleted: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setTheme } = useTheme();

  const fetchUser = useCallback(async () => {
    try {
      const authToken = cookieService.getCookie("authToken");
      if (!authToken) {
        setIsLoading(false);
        setUser(null);
        return;
      }
      const response: any = await profileService.getProfile();
      if (response) {
        const userData = response?.user || response;
        const mergedUser = response?.user
          ? { ...response, ...response.user }
          : response;
        setUser(mergedUser as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user in AuthContext:", error);
      setUser(null);
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

  const logout = useCallback(() => {
    cookieService.deleteCookie("user");
    cookieService.deleteCookie("authToken");
    setUser(null);
    setTheme("light");
    router.push("/auth/login");
  }, [router, setTheme]);

  const status = user?.status || null;
  const isActive = status === "active";
  const isPending = status === "pending";
  const isPendingOrInactive = status === "pending" || status === "inactive";

  const value = {
    user,
    isLoading,
    status,
    isActive,
    isPending,
    isPendingOrInactive,
    isProfileCompleted: !!user?.is_profile_completed,
    isBasicCompleted: !!user?.is_basic,
    isAddressCompleted: !!user?.is_address,
    isDocumentCompleted: !!user?.is_document,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
