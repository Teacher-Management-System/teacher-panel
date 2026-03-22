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
import { cn } from "@/lib/utils";
import profileService from "../api.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        if (type === "aadhar_back") {
          setShowSuccessModal(true);
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
          <div className="space-y-1.5 border border-dashed border-slate-200 rounded-2xl p-6 bg-[#f8f9fa]/50 hover:bg-[#f8f9fa] transition-colors relative group text-center flex flex-col items-center justify-center min-h-[160px]">
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
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Uploading...
                </p>
              </div>
            ) : aadharFront.preview || aadharFront.existingUrl ? (
              <div className="relative w-full h-[250px] rounded-lg overflow-hidden border border-slate-200">
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
                <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Upload Front Side
                </p>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  JPG, PNG or PDF (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Back Side */}
          <div
            className={cn(
              "space-y-1.5 border border-dashed border-slate-200 rounded-2xl p-6 bg-[#f8f9fa]/50 hover:bg-[#f8f9fa] transition-colors relative group text-center flex flex-col items-center justify-center min-h-[160px]",
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
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Uploading...
                </p>
              </div>
            ) : aadharBack.preview || aadharBack.existingUrl ? (
              <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-slate-200">
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
                <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Upload Back Side
                </p>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  JPG, PNG or PDF (Max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Note Alert */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100/50 text-amber-800">
          <div className="bg-white rounded-full p-1 shadow-sm mt-0.5 border border-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">
              Verification Note
            </h4>
            <p className="text-xs text-amber-700/80 font-medium">
              Your documents will be verified by our team within 24-48 hours.
              Please ensure the uploaded images are clear and all details are
              visible.
            </p>
          </div>
        </div>
      </section>

      {/* Footer actions */}
      <div className="pt-8 mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            All changes are auto-saved
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto px-6 h-12 rounded-xl border-slate-200 text-slate-600 font-semibold shadow-none hover:bg-slate-50"
            onClick={() =>
              document
                .querySelector<HTMLElement>(
                  '[data-state="active"][value="address"]',
                )
                ?.click()
            }
          >
            Previous Step
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto px-8 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-none transition-all hover:-translate-y-0.5 flex items-center gap-2"
            onClick={() => {
              if (aadharFront.isUploaded && aadharBack.isUploaded) {
                setShowSuccessModal(true);
              } else {
                toast.error("Please upload both sides of Aadhar card first");
              }
            }}
          >
            <CheckCircle2 className="w-4 h-4" /> Save & Complete Profile
          </Button>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[440px] w-[calc(100%-2rem)] mx-auto rounded-[32px] p-8 pb-10 border-0 shadow-2xl overflow-hidden [&>button]:hidden bg-white">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-90" />
          
          <div className="flex flex-col items-center justify-center text-center mt-4">
            {/* Custom squircle icon */}
            <div className="relative mb-10 mt-2">
              <div className="absolute inset-0 bg-[#0bb882] rounded-[32px] rotate-6 blur-xl opacity-40 scale-110" />
              <div className="relative bg-[#0bb882] text-white w-28 h-28 rounded-[36px] flex items-center justify-center rotate-[-3deg] shadow-lg">
                <div className="bg-white rounded-full p-2.5 flex items-center justify-center rotate-[3deg] shadow-sm">
                  <Check className="w-10 h-10 text-[#0bb882] stroke-[4]" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-4 font-display">
              Profile Completed!
            </h2>
            
            <p className="text-[15px] font-medium text-[#64748b] leading-relaxed mb-10 px-2">
              Great job! Your profile is now 100% complete. <br className="hidden sm:block"/>
              You've unlocked all the features of the <br className="hidden sm:block"/>
              <span className="font-bold text-[#5b21b6]">Aerophantom Academy</span> panel.
            </p>

            <div className="flex flex-col w-full gap-3 mb-10">
              <Button
                asChild
                className="w-full h-[56px] rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-[15px] shadow-[0_8px_30px_rgb(15,23,42,0.15)] transition-all hover:-translate-y-0.5"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full h-[56px] rounded-2xl bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#475569] hover:text-[#334155] font-bold text-[15px] transition-colors"
                onClick={() => window.location.reload()}
              >
                View My Profile
              </Button>
            </div>

            {/* Footer avatars */}
            <div className="flex flex-row items-center justify-center gap-3">
              <div className="flex -space-x-3">
                <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 object-cover" src="https://i.pravatar.cc/100?img=68" alt="Student" />
                <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 object-cover" src="https://i.pravatar.cc/100?img=32" alt="Student" />
                <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 object-cover" src="https://i.pravatar.cc/100?img=47" alt="Student" />
              </div>
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.10em]">
                Joined 2k+ Students
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
