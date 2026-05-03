"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  User,
  Phone,
  Briefcase,
  GraduationCap,
  Building2,
  CalendarDays,
  BookOpen,
  IndianRupee,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentReminderDialog from "@/components/PaymentReminderDialogProps";
import profileService from "../aou.service";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type Qualification = "undergraduate" | "graduate" | "postgraduate";
type CurrentStatus = "college_student" | "employed" | "unemployed";

interface ProfileFormData {
  fullName: string;
  fatherName: string;
  gender: string;
  dob: Date | undefined;
  contactNumber: string;
  email: string;
  qualification: Qualification | "";
  currentStatus: CurrentStatus | "";
  collegeName: string;
  course: string;
  year: string;
  organizationName: string;
  designation: string;
  monthlyPaymentExpectation: string;
}

const ProfileForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user, isPending, isProfileCompleted, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    fatherName: "",
    gender: "",
    dob: undefined,
    contactNumber: "",
    email: "",
    qualification: "",
    currentStatus: "",
    collegeName: "",
    course: "",
    year: "",
    organizationName: "",
    designation: "",
    monthlyPaymentExpectation: "",
  });
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    if (user) {
      const d = user as any;
      const u = d?.user || d;

      setFormData({
        fullName: u?.name || d?.name || "",
        fatherName: u?.father_name || d?.father_name || "",
        gender: (u?.gender || d?.gender || "").toLowerCase().trim(),
        dob: (() => {
          const dobValue = u?.dob || d?.dob;
          if (!dobValue) return undefined;
          return new Date(
            !isNaN(Number(dobValue)) && Math.abs(Number(dobValue)) < 100000000000
              ? Number(dobValue) * 1000
              : dobValue,
          );
        })(),
        contactNumber: String(u?.mobile || d?.mobile || "").replace(/^\+91/, ""),
        email: u?.email || d?.email || "",
        qualification: (() => {
          const q = String(u?.qualification_level || d?.qualification_level || "").toLowerCase().trim();
          if (q.includes("under")) return "undergraduate";
          if (q.includes("post")) return "postgraduate";
          if (q.includes("grad")) return "graduate";
          return "";
        })(),
        currentStatus: (u?.current_status || d?.current_status || "").toLowerCase().trim() as CurrentStatus,
        collegeName: u?.college_name || d?.college_name || "",
        course: u?.course || d?.course || "",
        year: String(u?.year || d?.year || ""),
        organizationName: u?.organization_name || d?.organization_name || "",
        designation: u?.designation || d?.designation || "",
        monthlyPaymentExpectation: String(u?.monthly_payment_expectation || d?.monthly_payment_expectation || ""),
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      if (isPending) {
        router.push("/profile/unlockProfile");
      }
    }
  }, [isLoading, isPending, router]);

  const handleInputChange = (
    field: keyof ProfileFormData,
    value: string | Date | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isProfileCompleted) {
      if (onSuccess) onSuccess();
      return;
    }

    // Basic Validation
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.fatherName.trim())
      return toast.error("Father's Name is required");
    if (!formData.gender) return toast.error("Gender is required");
    if (!formData.dob) return toast.error("Date of Birth is required");
    if (!formData.contactNumber.trim())
      return toast.error("Mobile Number is required");
    if (!formData.qualification)
      return toast.error("Highest Qualification is required");
    if (!formData.currentStatus)
      return toast.error("Current Status is required");

    // Dynamic Validation based on Current Status
    if (formData.currentStatus === "college_student") {
      if (!formData.collegeName.trim())
        return toast.error("College Name is required");
      if (!formData.course.trim()) return toast.error("Course is required");
      if (!formData.year) return toast.error("Year of study is required");
    } else if (formData.currentStatus === "employed") {
      if (!formData.organizationName.trim())
        return toast.error("Organization Name is required");
      if (!formData.designation.trim())
        return toast.error("Current Designation is required");
    } else if (formData.currentStatus === "unemployed") {
      if (!formData.monthlyPaymentExpectation.trim())
        return toast.error("Monthly Expectation is required");
    }

    setLoading(true);

    const payload = {
      name: formData.fullName,
      father_name: formData.fatherName,
      gender: formData.gender,
      dob: formData.dob ? format(formData.dob, "yyyy-MM-dd") : null,
      mobile: formData.contactNumber,
      qualification: formData.qualification,
      current_status: formData.currentStatus,
      college_name: formData.collegeName,
      course: formData.course,
      year: formData.year,
      organization_name: formData.organizationName,
      designation: formData.designation,
      monthly_payment_expectation: formData.monthlyPaymentExpectation,
    };

    try {
      await profileService.updateProfile(payload);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    setShowPaymentDialog(false);
    console.log("Pay Now clicked, form data:", formData);
  };

  const handleCancelPayment = () => {
    setShowPaymentDialog(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-10 animate-in fade-in duration-500"
      >
        {/* Personal Details Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
              Personal Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                className="bg-muted/50 border-border rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                disabled={isProfileCompleted}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="fatherName"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
              >
                Father's Name
              </Label>
              <Input
                id="fatherName"
                placeholder="Enter father's name"
                className="bg-muted/50 border-border rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                value={formData.fatherName}
                onChange={(e) =>
                  handleInputChange("fatherName", e.target.value)
                }
                disabled={isProfileCompleted}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Gender
              </Label>
              <Select
                key={formData.gender}
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                disabled={isProfileCompleted}
              >
                <SelectTrigger className="bg-muted/50 border-border rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Date of Birth
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild disabled={isProfileCompleted}>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full px-4 h-11 justify-between text-left font-normal bg-muted/50 border-border rounded-xl shadow-none hover:bg-muted",
                      !formData.dob && "text-muted-foreground",
                    )}
                    disabled={isProfileCompleted}
                  >
                    {formData.dob ? (
                      format(formData.dob, "dd-MM-yyyy")
                    ) : (
                      <span>dd-mm-yyyy</span>
                    )}
                    <CalendarIcon className="h-4 w-4 text-muted-foreground/40" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dob}
                    onSelect={(date) => {
                      handleInputChange("dob", date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                    fromYear={1950}
                    toYear={new Date().getFullYear()}
                    disabled={{ after: new Date() }}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* In case user had specific other fields mapped to Personal Details based on their existing state */}
            {/* If more are needed here based on the screenshots we can add placeholder ones, but matching their state is better. */}
          </div>
        </section>

        {/* Contact Info Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Phone className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
              Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="contactNumber"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
              >
                Mobile Number
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="12345 67890"
                className="bg-muted/50 border-border rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
                disabled={isProfileCompleted}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="bg-muted/50 border-border rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                value={formData.email}
                readOnly
                disabled
              />
            </div>
          </div>
        </section>

        {/* Professional Info Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
              Education & Work
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Highest Qualification
              </Label>
              <Select
                key={formData.qualification}
                value={formData.qualification}
                onValueChange={(value: Qualification) =>
                  handleInputChange("qualification", value)
                }
                disabled={isProfileCompleted}
              >
                <SelectTrigger className="bg-muted/50 border-border rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 w-full">
                  <SelectValue placeholder="e.g. M.Tech in AI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Under Graduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="postgraduate">Post Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:col-span-3 mt-4">
              <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Current Status
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* College Student Card */}
                <div
                  className={cn(
                    "border rounded-2xl p-4 transition-all flex flex-col justify-center min-h-[90px]",
                    formData.currentStatus === "college_student"
                      ? "border-indigo-500 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/50"
                      : "border-border bg-muted/30 hover:bg-muted/50",
                    (isProfileCompleted && "cursor-default opacity-80") ||
                    "cursor-pointer",
                  )}
                  onClick={() =>
                    !isProfileCompleted &&
                    handleInputChange("currentStatus", "college_student")
                  }
                >
                  <h4
                    className={cn(
                      "text-base font-extrabold",
                      formData.currentStatus === "college_student"
                        ? "text-indigo-400"
                        : "text-foreground",
                    )}
                  >
                    College Student
                  </h4>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider mt-1">
                    Currently Studying
                  </p>
                </div>

                {/* Employed Card */}
                <div
                  className={cn(
                    "border rounded-2xl p-4 transition-all flex flex-col justify-center min-h-[90px]",
                    formData.currentStatus === "employed"
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/50"
                      : "border-border bg-muted/30 hover:bg-muted/50",
                    (isProfileCompleted && "cursor-default opacity-80") ||
                    "cursor-pointer",
                  )}
                  onClick={() =>
                    !isProfileCompleted &&
                    handleInputChange("currentStatus", "employed")
                  }
                >
                  <h4
                    className={cn(
                      "text-base font-extrabold",
                      formData.currentStatus === "employed"
                        ? "text-emerald-400"
                        : "text-foreground",
                    )}
                  >
                    Employed
                  </h4>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider mt-1">
                    Working Professional
                  </p>
                </div>

                {/* Unemployed Card */}
                <div
                  className={cn(
                    "border rounded-2xl p-4 transition-all flex flex-col justify-center min-h-[90px]",
                    formData.currentStatus === "unemployed"
                      ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/50"
                      : "border-border bg-muted/30 hover:bg-muted/50",
                    (isProfileCompleted && "cursor-default opacity-80") ||
                    "cursor-pointer",
                  )}
                  onClick={() =>
                    !isProfileCompleted &&
                    handleInputChange("currentStatus", "unemployed")
                  }
                >
                  <h4
                    className={cn(
                      "text-base font-extrabold",
                      formData.currentStatus === "unemployed"
                        ? "text-orange-400"
                        : "text-foreground",
                    )}
                  >
                    Unemployed
                  </h4>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider mt-1">
                    Looking for Opportunities
                  </p>
                </div>
              </div>
            </div>

            {/* Conditional Fields mapped into the same grid */}
            {formData.currentStatus === "college_student" && (
              <>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="collegeName"
                    className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
                  >
                    College Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                    <Input
                      id="collegeName"
                      placeholder="Enter college name"
                      className="pl-10 bg-muted/50 border-border rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.collegeName}
                      onChange={(e) =>
                        handleInputChange("collegeName", e.target.value)
                      }
                      disabled={isProfileCompleted}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="course"
                    className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
                  >
                    Course
                  </Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                    <Input
                      id="course"
                      placeholder="e.g. B.Tech CSE"
                      className="pl-10 bg-muted/50 border-border rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.course}
                      onChange={(e) =>
                        handleInputChange("course", e.target.value)
                      }
                      disabled={isProfileCompleted}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    Year
                  </Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40 z-10 pointer-events-none" />
                    <Select
                      value={formData.year}
                      onValueChange={(v) => handleInputChange("year", v)}
                      disabled={isProfileCompleted}
                    >
                      <SelectTrigger className="pl-10 bg-muted/50 border-border rounded-xl h-11 !h-11 shadow-none focus:ring-1 focus:ring-primary/30 w-full relative">
                        <SelectValue placeholder="e.g. 3rd Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                            {y === 1
                              ? "st"
                              : y === 2
                                ? "nd"
                                : y === 3
                                  ? "rd"
                                  : "th"}{" "}
                            Year
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {formData.currentStatus === "employed" && (
              <>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="organizationName"
                    className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
                  >
                    Organization Name
                  </Label>
                  <div className="relative">
                    <Home className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                    <Input
                      id="organizationName"
                      placeholder="Enter organization name"
                      className="pl-10 bg-muted/50 border-border rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.organizationName}
                      onChange={(e) =>
                        handleInputChange("organizationName", e.target.value)
                      }
                      disabled={isProfileCompleted}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="designation"
                    className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
                  >
                    Current Designation
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                    <Input
                      id="designation"
                      placeholder="Enter your designation"
                      className="pl-10 bg-muted/50 border-border rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                      disabled={isProfileCompleted}
                    />
                  </div>
                </div>
              </>
            )}

            {formData.currentStatus === "unemployed" && (
              <div className="space-y-1.5 md:col-span-2">
                <Label
                  htmlFor="monthlyPaymentExpectation"
                  className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
                >
                  Monthly Expectation
                </Label>
                <div className="relative">
                  <div className="absolute left-1.5 top-1.5 bottom-1.5 w-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <IndianRupee
                      className="h-4 w-4 text-orange-500 font-bold"
                      strokeWidth={3}
                    />
                  </div>
                  <Input
                    id="monthlyPaymentExpectation"
                    type="number"
                    placeholder="Enter expected earnings"
                    className="pl-12 bg-muted/50 border-border rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    value={formData.monthlyPaymentExpectation}
                    onChange={(e) =>
                      handleInputChange(
                        "monthlyPaymentExpectation",
                        e.target.value,
                      )
                    }
                    disabled={isProfileCompleted}
                  />
                </div>
                <p className="text-[10px] italic font-medium text-muted-foreground/40 mt-1">
                  * This helps us find relevant opportunities for you.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer actions */}
        <div className="pt-8 mt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              All changes are auto-saved
            </span>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto px-10 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-none transition-all hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isProfileCompleted
                ? "Next Step"
                : "Next Step"}
          </Button>
        </div>
      </form>

      <PaymentReminderDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPayNow={handlePayNow}
        onCancel={handleCancelPayment}
      />
    </>
  );
};

export default ProfileForm;
