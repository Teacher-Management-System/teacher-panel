"use client";

import ProfileComplete from "@/features/profile/components/profile-complete";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { isPending, isProfileCompleted, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isPending) {
        router.push("/profile/unlockProfile");
      } else if (!isProfileCompleted) {
        router.push("/profile/basic");
      }
    }
  }, [isLoading, isPending, isProfileCompleted, router]);

  if (isLoading || isPending || !isProfileCompleted) {
    return null;
  }

  return (
    <div className="py-6 sm:px-6">
      <ProfileComplete onEdit={() => router.push("/profile/basic")} />
    </div>
  );
}
