"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  TrendingUp,
  Settings,
  LogOut,
  Briefcase,
  CalendarDays,
  BookOpen,
  GraduationCap,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Globe2,
  Camera,
  Loader2,
} from "lucide-react";
import profileService from "../aou.service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRef } from "react";

export default function ProfileComplete({ onEdit }: { onEdit: () => void }) {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    profile: null as any,
    address: null as any,
    documents: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await profileService.getProfile();
        const userData = response?.user || response;

        setData({
          profile: userData,
          address: userData?.address || null,
          documents: userData?.documents || [],
        });
      } catch (error) {
        console.error("Failed to fetch profile complete details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploadingPhoto(true);
    try {
      await profileService.updatePhoto(formData);
      toast.success("Profile picture updated successfully!");
      refreshUser();
      // Also refresh local data to show new photo
      const response: any = await profileService.getProfile();
      const userData = response?.user || response;
      setData((prev) => ({
        ...prev,
        profile: userData,
      }));
    } catch (error) {
      console.error("Failed to update profile photo:", error);
      toast.error("Failed to update profile photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center font-bold text-slate-400">
        Loading your profile details...
      </div>
    );
  }

  const { profile, address, documents } = data;
  const aadharFront = documents.find((d) => d.document_type === "aadhar_front");
  const aadharBack = documents.find((d) => d.document_type === "aadhar_back");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-card shadow-sm border border-border">
        <div className="h-44 w-full bg-gradient-to-r from-blue-600 via-teal-400 to-emerald-400 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="px-6 sm:px-10 pb-8 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 relative z-10">
            <div className="relative group/avatar">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card bg-muted overflow-hidden shadow-lg flex-shrink-0 flex items-center justify-center text-4xl md:text-5xl font-black text-muted-foreground/40 relative">
                {(profile?.avatar || profile?.profile_picture) ? (
                  <img
                    src={profile.avatar || profile.profile_picture}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                  />
                ) : (
                  <span className="uppercase">
                    {profile?.name?.charAt(0) || user?.name?.charAt(0) || "?"}
                  </span>
                )}

                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center z-10"
                >
                  <Camera className="w-8 h-8 text-white stroke-[2.5]" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
            <div className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {profile?.name || user?.name || "Your Name"}
                </h1>
                <div className="bg-emerald-500/10 text-emerald-500 w-fit flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="text-[10px] font-extrabold tracking-widest uppercase">
                    Verified Profile
                  </span>
                </div>
              </div>
              <div className="flex wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {address?.city && address?.state
                    ? `${address.city}, ${address.state}`
                    : "Location not added"}
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ID:{" "}
                  {profile?.teacher_id ||
                    `AP${String(user?.id || 0).padStart(4, "0")}`}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={onEdit}
              className="w-full md:w-auto bg-[#1e293b] hover:bg-slate-800 text-white rounded-xl h-12 px-6 font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Settings className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-[32px] p-6 sm:p-10 shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-500/10 p-3 rounded-2xl">
                <User className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6">
              <InfoRow
                icon={User}
                label="Father's Name"
                value={profile?.father_name || "N/A"}
              />
              <InfoRow
                icon={User}
                label="Gender"
                value={
                  (profile?.gender || user?.gender)
                    ? (profile?.gender || user?.gender).charAt(0).toUpperCase() +
                      (profile?.gender || user?.gender).slice(1)
                    : "N/A"
                }
              />
              <InfoRow
                icon={CalendarDays}
                label="Date of Birth"
                value={
                  profile?.dob
                    ? new Date(
                        typeof profile.dob === "number"
                          ? profile.dob * 1000
                          : profile.dob,
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"
                }
              />
              <InfoRow icon={ShieldCheck} label="Category" value={"General"} />
              <InfoRow
                icon={BookOpen}
                label="Course"
                value={profile?.course || "N/A"}
              />
              <InfoRow
                icon={Phone}
                label="Mobile Number"
                value={
                  (profile?.mobile || user?.mobile)
                    ? (profile?.mobile || user?.mobile).replace(/^\+91/, "")
                    : "N/A"
                }
              />
              <InfoRow
                icon={Mail}
                label="Email Address"
                value={profile?.email || "N/A"}
              />
            </div>
          </div>

          {/* Address Details */}
          <div className="bg-card rounded-[32px] p-6 sm:p-10 shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-indigo-500/10 p-3 rounded-2xl">
                <MapPin className="w-6 h-6 text-indigo-500 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Address Details
              </h2>
            </div>

            <div className="bg-muted/50 rounded-[20px] p-6 mb-6 border border-border/50">
              <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">
                Current Address
              </p>
              <p className="text-sm sm:text-base font-bold text-foreground leading-snug">
                {address?.address_line1
                  ? `${address.address_line1}, ${address.address_line2 ? address.address_line2 + ", " : ""}${address.city}, ${address.state} - ${address.pincode}`
                  : "Address not provided"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-muted/50 border border-border/50 rounded-[20px] p-5 flex items-center gap-4">
                <div className="bg-card p-2.5 rounded-xl shadow-sm border border-border">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest">
                    City
                  </p>
                  <p className="text-[15px] font-bold text-foreground mt-0.5">
                    {address?.city || "N/A"}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 border border-border/50 rounded-[20px] p-5 flex items-center gap-4">
                <div className="bg-card p-2.5 rounded-xl shadow-sm border border-border">
                  <Globe2 className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest">
                    State
                  </p>
                  <p className="text-[15px] font-bold text-foreground mt-0.5">
                    {address?.state || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Documents */}
          <div className="bg-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-border flex flex-col h-fit">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-amber-500/10 p-3 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-amber-500 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Documents</h2>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.1em] mb-3">
                  Aadhar Card (Front)
                </p>
                <div className="h-44 w-full rounded-[24px] overflow-hidden shadow-sm border border-border bg-muted/50">
                  {aadharFront?.document_path ? (
                    <img
                      src={aadharFront.document_path}
                      alt="Aadhar Front"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 font-medium">
                      No Document
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.1em] mb-3">
                  Aadhar Card (Back)
                </p>
                <div className="h-44 w-full rounded-[24px] overflow-hidden shadow-sm border border-border bg-muted/50">
                  {aadharBack?.document_path ? (
                    <img
                      src={aadharBack.document_path}
                      alt="Aadhar Back"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 font-medium">
                      No Document
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icon className="w-5 h-5 text-muted-foreground/60 stroke-[2]" />
      </div>
      <div>
        <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-[15px] font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
