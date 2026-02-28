"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, FileText, Lock } from "lucide-react";
import ProfileForm from "./basic";
import AddressDetails from "@/features/profile/components/AddressDetails";
import DocumentDetails from "@/features/profile/components/DocumentDetails";
import { useAuth } from "@/hooks/useAuth";
import profileService from "../api.service";
import { toast } from "sonner";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAddressCompleted, setIsAddressCompleted] = useState(false);
  const { user, refreshUser } = useAuth();
  const isCompleted = !!user?.is_completed;

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
        setIsAddressCompleted(true);
      } else {
        setIsAddressCompleted(false);
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
    if (!isCompleted && (value === "address" || value === "documents")) {
      toast.info("Please fill and save your Basic Details first");
      return;
    }
    if (value === "documents" && !isAddressCompleted) {
      toast.info("Please fill and save your Address Details first");
      return;
    }
    setActiveTab(value);
  };

  const handleBasicSuccess = async () => {
    await refreshUser();
    setActiveTab("address");
  };

  const handleAddressSuccess = async () => {
    setIsAddressCompleted(true);
    setActiveTab("documents");
  };

  return (
    <div className="container-fluid">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information, address, and documents.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabClick}
        className="w-full mt-5"
      >
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="basic"
            className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Basic Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="address"
            disabled={!isCompleted}
            className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleted ? (
              <MapPin className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4 opacity-70" />
            )}
            <span className="hidden sm:inline">Address Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            disabled={!isAddressCompleted}
            className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddressCompleted ? (
              <FileText className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4 opacity-70" />
            )}
            <span className="hidden sm:inline">Document Details</span>
          </TabsTrigger>
        </TabsList>

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
                <DocumentDetails />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
