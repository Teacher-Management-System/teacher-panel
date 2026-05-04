"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Loader2,
  PartyPopper,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import profileService from "../aou.service";

interface DocumentState {
  file: File | null;
  preview: string | null;
  existingUrl: string | null;
  isUploading: boolean;
  isUploaded: boolean;
}

export default function DocumentDetails({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const {
    isPending,
    isProfileCompleted,
    isLoading,
    user,
    isBasicCompleted,
    isAddressCompleted,
  } = useAuth();
  const router = useRouter();
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [hasAddress, setHasAddress] = useState(false);
  const [aadharFront, setAadharFront] = useState<DocumentState>({
    file: null,
    preview: null,
    existingUrl: null,
    isUploading: false,
    isUploaded: false,
  });
  const [aadharBack, setAadharBack] = useState<DocumentState>({
    file: null,
    preview: null,
    existingUrl: null,
    isUploading: false,
    isUploaded: false,
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.documents && Array.isArray(user.documents)) {
      const docs = user.documents;
      const front = docs.find((d: any) => d.document_type === "aadhar_front");
      const back = docs.find((d: any) => d.document_type === "aadhar_back");

      if (front) {
        setAadharFront((prev) => ({
          ...prev,
          existingUrl: front.document_path,
          isUploaded: true,
        }));
      }
      if (back) {
        setAadharBack((prev) => ({
          ...prev,
          existingUrl: back.document_path,
          isUploaded: true,
        }));
      }
    }
  }, [user]);

  useEffect(() => {
    const checkAddress = async () => {
      if (!isLoading && user?.is_profile_completed) {
        try {
          const response: any = await profileService.getAddress();
          if (response?.address) {
            setHasAddress(true);
          }
        } catch (error) {
          console.error("Failed to check address:", error);
        } finally {
          setIsAddressLoading(false);
        }
      } else {
        setIsAddressLoading(false);
      }
    };
    checkAddress();
  }, [isLoading, user]);

  useEffect(() => {
    if (!isLoading && !isAddressLoading) {
      if (isPending) {
        router.push("/profile/unlockProfile");
      } else if (!isBasicCompleted) {
        toast.info("Please complete basic details first");
        router.push("/profile/basic");
      } else if (!isAddressCompleted) {
        toast.info("Please complete address details first");
        router.push("/profile/address");
      }
    }
  }, [
    isLoading,
    isAddressLoading,
    isPending,
    isProfileCompleted,
    user,
    hasAddress,
    router,
  ]);

  const uploadFile = async (
    file: File,
    type: "aadhar_front" | "aadhar_back",
    setDocState: React.Dispatch<React.SetStateAction<DocumentState>>,
  ) => {
    setDocState((prev) => ({ ...prev, isUploading: true }));

    const formData = new FormData();
    formData.append("document_type", type);
    formData.append("document_image", file);
    try {
      const response = await profileService.uploadDocument(formData);
      if (response && response.user_documents) {
        setDocState((prev) => ({
          ...prev,
          isUploaded: true,
          isUploading: false,
        }));
        if (type === "aadhar_back") {
          await onSuccess?.();
          router.push("/profile");
        }
      } else {
        toast.error(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setDocState((prev) => ({
        ...prev,
        isUploading: false,
        file: null,
        preview: null,
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "aadhar_front" | "aadhar_back",
    setDocState: React.Dispatch<React.SetStateAction<DocumentState>>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setDocState((prev) => ({
          ...prev,
          file,
          preview: reader.result as string,
        }));
        uploadFile(file, type, setDocState);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section>
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Identity Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Front Side */}
          <div className="space-y-1.5 border border-dashed border-border rounded-2xl p-6 bg-muted/30 hover:bg-muted/50 transition-colors relative group text-center flex flex-col items-center justify-center min-h-[160px]">
            {!aadharFront.isUploading && !aadharFront.isUploaded && (
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) =>
                  handleFileChange(e, "aadhar_front", setAadharFront)
                }
              />
            )}

            {aadharFront.isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Uploading...
                </p>
              </div>
            ) : aadharFront.preview || aadharFront.existingUrl ? (
              <div className="relative w-full h-[250px] rounded-lg overflow-hidden border border-border">
                <img
                  src={aadharFront.preview || aadharFront.existingUrl!}
                  alt="Aadhar Front"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!aadharFront.isUploaded && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                    <p className="text-white font-medium flex items-center text-sm">
                      <Upload className="w-4 h-4 mr-2" /> Change
                    </p>
                  </div>
                )}
                {aadharFront.isUploaded && !aadharFront.isUploading && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 z-30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <div className="bg-card border border-border p-3 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-1">
                  Upload Front Side
                </p>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground/40 tracking-wider">
                  JPG, PNG or PDF (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Back Side */}
          <div
            className={cn(
              "space-y-1.5 border border-dashed border-border rounded-2xl p-6 bg-muted/30 hover:bg-muted/50 transition-colors relative group text-center flex flex-col items-center justify-center min-h-[160px]",
              !aadharFront.isUploaded && "opacity-50 grayscale",
            )}
          >
            {aadharFront.isUploaded &&
              !aadharBack.isUploading &&
              !aadharBack.isUploaded && (
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) =>
                    handleFileChange(e, "aadhar_back", setAadharBack)
                  }
                />
              )}

            {aadharBack.isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Uploading...
                </p>
              </div>
            ) : aadharBack.preview || aadharBack.existingUrl ? (
              <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-border">
                <img
                  src={aadharBack.preview || aadharBack.existingUrl!}
                  alt="Aadhar Back"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!aadharBack.isUploaded && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                    <p className="text-white font-medium flex items-center text-sm">
                      <Upload className="w-4 h-4 mr-2" /> Change
                    </p>
                  </div>
                )}
                {aadharBack.isUploaded && !aadharBack.isUploading && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 z-30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <div className="bg-card border border-border p-3 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-1">
                  Upload Back Side
                </p>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground/40 tracking-wider">
                  JPG, PNG or PDF (Max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Note Alert */}
        {!(aadharFront.isUploaded && aadharBack.isUploaded) && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
            <div className="bg-card rounded-full p-1 shadow-sm mt-0.5 border border-amber-500/20">
              <AlertCircle
                className="w-4 h-4 text-amber-500"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
                Verification Note
              </h4>
              <p className="text-xs text-amber-500/80 font-medium">
                Your documents will be verified by our team within 24-48 hours.
                Please ensure the uploaded images are clear and all details are
                visible.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Footer actions */}
      <div className="pt-8 mt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            All changes are auto-saved
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            className="w-full sm:w-auto px-8 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-none transition-all hover:-translate-y-0.5 flex items-center gap-2"
            onClick={async () => {
              if (aadharFront.isUploaded && aadharBack.isUploaded) {
                await onSuccess?.();
                router.push("/profile");
              } else {
                toast.error("Please upload both sides of Aadhar card first");
              }
            }}
          >
            <CheckCircle2 className="w-4 h-4" />{" "}
            {isProfileCompleted ? "Save Profile" : "Save & Complete Profile"}
          </Button>
        </div>
      </div>

    </div>
  );
}
