"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CircleUser,
  Home,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileForm from "./basic";
import AddressDetails from "@/features/profile/components/AddressDetails";
import DocumentDetails from "@/features/profile/components/DocumentDetails";
import ProfileComplete from "./profile-complete";
import { useAuth } from "@/hooks/useAuth";
import profileService from "../aou.service";
import { toast } from "sonner";

export default function ProfileTabs({
  isUpdateMode = false,
  currentTab = "basic",
}: {
  isUpdateMode?: boolean;
  currentTab?: string;
}) {
  const router = useRouter();
  const activeTab = currentTab;
  const {
    user,
    refreshUser,
    isLoading,
    isProfileCompleted,
    isBasicCompleted,
    isAddressCompleted,
  } = useAuth();
  const isCompleted = isProfileCompleted;

  // Fetch address to check if it's completed
  const checkAddressStatus = useCallback(async () => {
    try {
      const response: any = await profileService.getAddress();
      const data = response.data || response;
      if (
        data &&
        data.address_line1 &&
        data.city &&
        data.state &&
        data.pincode
      ) {
        if (response?.address) {
          // Address check complete
        }
      }
    } catch (error) {
      console.error("Failed to check address status:", error);
    }
  }, []);

  useEffect(() => {
    if (isCompleted) {
      checkAddressStatus();
    }
  }, [isCompleted, checkAddressStatus]);

  const handleTabClick = (value: string) => {
    if (!isBasicCompleted && (value === "address" || value === "documents")) {
      toast.info("Please fill and save your Basic Details first");
      return;
    }
    if (value === "documents" && !isAddressCompleted) {
      toast.info("Please fill and save your Address Details first");
      return;
    }
    router.push(`/profile/${value}`);
  };

  const handleBasicSuccess = async () => {
    await refreshUser();
    router.push("/profile/address");
  };

  const handleAddressSuccess = async () => {
    await refreshUser();
    router.push("/profile/documents");
  };

  if (isLoading && !user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (isCompleted && !isUpdateMode) {
    return (
      <div className="py-6 sm:px-6">
        <ProfileComplete onEdit={() => router.push("/profile/basic")} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {isProfileCompleted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-muted transition-colors"
              onClick={() => router.push("/profile")}
            >
              <ArrowLeft className="w-5 h-5 text-foreground stroke-[2.5]" />
            </Button>
          )}
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
        </div>
        <p className="text-muted-foreground ml-1">
          Manage your personal information, address, and documents.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabClick}
        className="w-full mt-6"
      >
        <div className="flex w-full overflow-x-auto pb-2 mb-2">
          <TabsList className="flex w-max h-auto p-1.5 bg-muted rounded-[20px] shadow-sm gap-1 mx-2 sm:mx-0 border border-border">
            {/* Step 1: Basic Details */}
            <TabsTrigger
              value="basic"
              className="flex items-center gap-2 py-2.5 px-5 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-muted-foreground font-medium transition-all duration-200 shadow-none data-[state=active]:shadow-sm border-none"
            >
              <CircleUser className="w-[18px] h-[18px] stroke-[2.5]" />
              <span className="whitespace-nowrap hidden sm:inline">
                Basic Details
              </span>
            </TabsTrigger>

            {/* Step 2: Address Details */}
            <TabsTrigger
              value="address"
              disabled={!isBasicCompleted}
              className="flex items-center gap-2 py-2.5 px-5 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-muted-foreground font-medium transition-all duration-200 shadow-none data-[state=active]:shadow-sm border-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Home className="w-[18px] h-[18px] stroke-[2.5]" />
              <span className="whitespace-nowrap hidden sm:inline">
                Address Details
              </span>
            </TabsTrigger>

            {/* Step 3: Document Details */}
            <TabsTrigger
              value="documents"
              disabled={!isAddressCompleted}
              className="flex items-center gap-2 py-2.5 px-5 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-muted-foreground font-medium transition-all duration-200 shadow-none data-[state=active]:shadow-sm border-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-[18px] h-[18px] stroke-[2.5]" />
              <span className="whitespace-nowrap hidden sm:inline">
                Document Details
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="basic" className="m-0 focus-visible:ring-0">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <ProfileForm onSuccess={handleBasicSuccess} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="m-0 focus-visible:ring-0">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <AddressDetails onSuccess={handleAddressSuccess} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="m-0 focus-visible:ring-0">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <DocumentDetails onSuccess={refreshUser} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
