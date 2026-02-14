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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import profileService from "../api.service";

interface DocumentState {
  file: File | null;
  preview: string | null;
  existingUrl: string | null;
}

export default function DocumentDetails() {
  const [loading, setLoading] = useState(false);
  const [aadharFront, setAadharFront] = useState<DocumentState>({
    file: null,
    preview: null,
    existingUrl: null,
  });
  const [aadharBack, setAadharBack] = useState<DocumentState>({
    file: null,
    preview: null,
    existingUrl: null,
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response: any = await profileService.getProfile();
        // Assuming response structure has these fields
        const data = response.user;
        if (data.aadhar?.front) {
          setAadharFront((prev) => ({
            ...prev,
            existingUrl: data.aadhar.front,
          }));
        }
        if (data.aadhar?.back) {
          setAadharBack((prev) => ({ ...prev, existingUrl: data.aadhar.back }));
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setDocState: React.Dispatch<React.SetStateAction<DocumentState>>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (
    setDocState: React.Dispatch<React.SetStateAction<DocumentState>>,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    setDocState((prev) => ({ ...prev, file: null, preview: null }));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (aadharFront.file) {
      formData.append("aadhar_front", aadharFront.file);
    }
    if (aadharBack.file) {
      formData.append("aadhar_back", aadharBack.file);
    }

    // Only call API if there are files to upload
    if (!aadharFront.file && !aadharBack.file) {
      toast.info("No new documents to upload");
      setLoading(false);
      return;
    }

    try {
      await profileService.updateProfile(formData);
      toast.success("Documents uploaded successfully");
    } catch (error) {
      console.error("Document upload failed:", error);
      toast.error("Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in duration-500"
    >
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
              {aadharFront.existingUrl && !aadharFront.file && (
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
                aadharFront.preview
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
              )}
            >
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => handleFileChange(e, setAadharFront)}
                disabled={loading}
              />

              {aadharFront.preview ? (
                <>
                  <img
                    src={aadharFront.preview}
                    alt="Aadhar Front Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                    <p className="text-white font-medium flex items-center">
                      <Upload className="w-4 h-4 mr-2" /> Change Image
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent triggering file input
                      removeFile(setAadharFront, frontInputRef);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : aadharFront.existingUrl ? (
                <>
                  <img
                    src={aadharFront.existingUrl}
                    alt="Aadhar Front"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 p-4 text-center">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full mb-3 shadow-sm">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      Click to update
                    </p>
                  </div>
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
            {aadharFront.file && (
              <div className="text-xs flex items-center text-primary/80 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-3 h-3 mr-1" /> New file selected:{" "}
                {aadharFront.file.name.substring(0, 20)}...
              </div>
            )}
          </div>

          {/* Back Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Back Side</Label>
              {aadharBack.existingUrl && !aadharBack.file && (
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
                aadharBack.preview
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
              )}
            >
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => handleFileChange(e, setAadharBack)}
                disabled={loading}
              />

              {aadharBack.preview ? (
                <>
                  <img
                    src={aadharBack.preview}
                    alt="Aadhar Back Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                    <p className="text-white font-medium flex items-center">
                      <Upload className="w-4 h-4 mr-2" /> Change Image
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFile(setAadharBack, backInputRef);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : aadharBack.existingUrl ? (
                <>
                  <img
                    src={aadharBack.existingUrl}
                    alt="Aadhar Back"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 p-4 text-center">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full mb-3 shadow-sm">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      Click to update
                    </p>
                  </div>
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
            {aadharBack.file && (
              <div className="text-xs flex items-center text-primary/80 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-3 h-3 mr-1" /> New file selected:{" "}
                {aadharBack.file.name.substring(0, 20)}...
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex items-start gap-2 p-4 bg-amber-500/10 text-amber-600 rounded-lg text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          Please ensure that your Aadhar card images are clear and strictly
          readable. Blurry or cut-off images may lead to verification issues.
        </p>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Save Documents"}
        </Button>
      </div>
    </form>
  );
}
