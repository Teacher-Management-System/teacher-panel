"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, FileText } from "lucide-react";
import ProfileForm from "./basic";
import AddressDetails from "@/features/profile/components/AddressDetails";
import DocumentDetails from "@/features/profile/components/DocumentDetails";

export default function ProfilePage() {
  return (
    <div className="container-fluid">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information, address, and documents.
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full mt-5">
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
            className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Address Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Document Details</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic" className="m-0 focus-visible:ring-0">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="m-0 focus-visible:ring-0">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <AddressDetails />
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
