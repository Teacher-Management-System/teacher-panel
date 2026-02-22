"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import profileService from "../api.service";

interface DocumentState {
  file: File | null;
  preview: string | null;
  existingUrl: string | null;
  isUploading: boolean;
  isUploaded: boolean;
}

export default function DocumentDetails() {
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
    const fetchDocuments = async () => {
      try {
        const response = await profileService.getDocuments();
        if (!response) return;
        const docs = response.user_documents || response;
        if (Array.isArray(docs)) {
          const front = docs.find(
            (d: any) => d.document_type === "aadhar_front",
          );
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
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };
    fetchDocuments();
  }, []);

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Aadhar Card Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Front Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Front Side</Label>
              {aadharFront.isUploaded && !aadharFront.isUploading && (
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Uploaded
                </Badge>
              )}
            </div>

            <div
              className={cn(
                "relative group h-64 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden bg-muted/30",
                aadharFront.preview || aadharFront.existingUrl
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                aadharFront.isUploading && "opacity-70 cursor-not-allowed",
              )}
            >
              {!aadharFront.isUploading && !aadharFront.isUploaded && (
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) =>
                    handleFileChange(e, "aadhar_front", setAadharFront)
                  }
                />
              )}

              {aadharFront.isUploading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <p className="text-sm font-medium">Uploading Front Side...</p>
                </div>
              ) : aadharFront.preview || aadharFront.existingUrl ? (
                <>
                  <img
                    src={aadharFront.preview || aadharFront.existingUrl!}
                    alt="Aadhar Front"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {!aadharFront.isUploaded && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                      <p className="text-white font-medium flex items-center">
                        <Upload className="w-4 h-4 mr-2" /> Change Image
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Click or drag to upload front side
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back Side */}
          <div
            className={cn(
              "space-y-4",
              !aadharFront.isUploaded &&
                "opacity-50 grayscale pointer-events-none",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Back Side</Label>
                {!aadharFront.isUploaded && (
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold py-0 h-4 border-amber-200 text-amber-600 bg-amber-50"
                  >
                    Front Required First
                  </Badge>
                )}
              </div>
              {aadharBack.isUploaded && !aadharBack.isUploading && (
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Uploaded
                </Badge>
              )}
            </div>

            <div
              className={cn(
                "relative group h-64 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden bg-muted/30",
                aadharBack.preview || aadharBack.existingUrl
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                (aadharBack.isUploading || !aadharFront.isUploaded) &&
                  "opacity-70 cursor-not-allowed",
              )}
            >
              {aadharFront.isUploaded &&
                !aadharBack.isUploading &&
                !aadharBack.isUploaded && (
                  <input
                    ref={backInputRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) =>
                      handleFileChange(e, "aadhar_back", setAadharBack)
                    }
                  />
                )}

              {aadharBack.isUploading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <p className="text-sm font-medium">Uploading Back Side...</p>
                </div>
              ) : aadharBack.preview || aadharBack.existingUrl ? (
                <>
                  <img
                    src={aadharBack.preview || aadharBack.existingUrl!}
                    alt="Aadhar Back"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {!aadharBack.isUploaded && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                      <p className="text-white font-medium flex items-center">
                        <Upload className="w-4 h-4 mr-2" /> Change Image
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Click or drag to upload back side
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-start gap-2 p-4 bg-amber-500/10 text-amber-600 rounded-lg text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          Please ensure that your Aadhar card images are clear and strictly
          readable. Blurry or cut-off images may lead to verification issues.
          <strong>
            {" "}
            Note: Upload the Front side first to enable the Back side upload.
          </strong>
        </p>
      </div>
    </div>
  );
}
