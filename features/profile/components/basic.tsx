"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import profileService from "../api.service";
import { toast } from "sonner";
import { useEffect } from "react";

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
    const fetchProfile = async () => {
      try {
        const response: any = await profileService.getProfile();
        const data = response.user;
        setFormData({
          fullName: data.name || "",
          fatherName: data.father_name || "",
          gender: data.gender || "",
          dob: data.dob
            ? new Date(
                !isNaN(Number(data.dob)) &&
                  Math.abs(Number(data.dob)) < 100000000000
                  ? Number(data.dob) * 1000
                  : data.dob,
              )
            : undefined,
          contactNumber: data.mobile || "",
          email: data.email || "",
          qualification: (data.qualification_level as Qualification) || "",
          currentStatus: (data.current_status as CurrentStatus) || "",
          collegeName: data.college_name || "",
          course: data.course || "",
          year: data.year ? String(data.year) : "",
          organizationName: data.organization_name || "",
          designation: data.designation || "",
          monthlyPaymentExpectation: data.monthly_payment_expectation
            ? String(data.monthly_payment_expectation)
            : "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    field: keyof ProfileFormData,
    value: string | Date | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
                className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                className="bg-[#f8f9fa] border-0 rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="fatherName"
                className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Father's Name
              </Label>
              <Input
                id="fatherName"
                placeholder="Enter father's name"
                className="bg-[#f8f9fa] border-0 rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                value={formData.fatherName}
                onChange={(e) =>
                  handleInputChange("fatherName", e.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger className="bg-[#f8f9fa] border-0 rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 w-full">
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
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Date of Birth
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full px-4 h-11 justify-between text-left font-normal bg-[#f8f9fa] border-0 rounded-xl shadow-none hover:bg-slate-100",
                      !formData.dob && "text-muted-foreground",
                    )}
                  >
                    {formData.dob ? (
                      format(formData.dob, "dd-MM-yyyy")
                    ) : (
                      <span>dd-mm-yyyy</span>
                    )}
                    <CalendarIcon className="h-4 w-4 text-slate-500" />
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
                className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Mobile Number
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="+91 12345 67890"
                className="bg-[#f8f9fa] border-0 rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="bg-[#f8f9fa] border-0 rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
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
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Highest Qualification
              </Label>
              <Select
                value={formData.qualification}
                onValueChange={(value: Qualification) =>
                  handleInputChange("qualification", value)
                }
              >
                <SelectTrigger className="bg-[#f8f9fa] border-0 rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 w-full">
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
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Current Status
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* College Student Card */}
                <div
                  className={cn(
                    "border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-center min-h-[90px]",
                    formData.currentStatus === "college_student"
                      ? "border-indigo-500 bg-white shadow-sm ring-1 ring-indigo-500"
                      : "border-slate-100 bg-[#f8f9fa] hover:bg-slate-50",
                  )}
                  onClick={() =>
                    handleInputChange("currentStatus", "college_student")
                  }
                >
                  <h4
                    className={cn(
                      "text-base font-extrabold",
                      formData.currentStatus === "college_student"
                        ? "text-indigo-900"
                        : "text-slate-700",
                    )}
                  >
                    College Student
                  </h4>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">
                    Currently Studying
                  </p>
                </div>

                {/* Employed Card */}
                <div
                  className={cn(
                    "border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-center min-h-[90px]",
                    formData.currentStatus === "employed"
                      ? "border-emerald-500 bg-white shadow-sm ring-1 ring-emerald-500"
                      : "border-slate-100 bg-[#f8f9fa] hover:bg-slate-50",
                  )}
                  onClick={() => handleInputChange("currentStatus", "employed")}
                >
                  <h4
                    className={cn(
                      "text-base font-extrabold",
                      formData.currentStatus === "employed"
                        ? "text-emerald-900"
                        : "text-slate-700",
                    )}
                  >
                    Employed
                  </h4>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">
                    Working Professional
                  </p>
                </div>

                {/* Unemployed Card */}
                <div
                  className={cn(
                    "border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-center min-h-[90px]",
                    formData.currentStatus === "unemployed"
                      ? "border-orange-500 bg-white shadow-sm ring-1 ring-orange-500"
                      : "border-slate-100 bg-[#f8f9fa] hover:bg-slate-50",
                  )}
                  onClick={() =>
                    handleInputChange("currentStatus", "unemployed")
                  }
                >
                  <h4
                    className={cn(
                      "text-base font-extrabold",
                      formData.currentStatus === "unemployed"
                        ? "text-orange-900"
                        : "text-slate-700",
                    )}
                  >
                    Unemployed
                  </h4>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">
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
                    className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                  >
                    College Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="collegeName"
                      placeholder="Enter college name"
                      className="pl-10 bg-[#f8f9fa] border-0 rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.collegeName}
                      onChange={(e) =>
                        handleInputChange("collegeName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="course"
                    className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                  >
                    Course
                  </Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="course"
                      placeholder="e.g. B.Tech CSE"
                      className="pl-10 bg-[#f8f9fa] border-0 rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.course}
                      onChange={(e) =>
                        handleInputChange("course", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Year
                  </Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <Select
                      value={formData.year}
                      onValueChange={(v) => handleInputChange("year", v)}
                    >
                      <SelectTrigger className="pl-10 bg-[#f8f9fa] border-0 rounded-xl h-11 !h-11 shadow-none focus:ring-1 focus:ring-primary/30 w-full relative">
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
                    className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                  >
                    Organization Name
                  </Label>
                  <div className="relative">
                    <Home className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="organizationName"
                      placeholder="Enter company name"
                      className="pl-10 bg-[#f8f9fa] border-0 rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.organizationName}
                      onChange={(e) =>
                        handleInputChange("organizationName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="designation"
                    className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                  >
                    Current Designation
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="designation"
                      placeholder="e.g. Software Engineer"
                      className="pl-10 bg-[#f8f9fa] border-0 rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {formData.currentStatus === "unemployed" && (
              <div className="space-y-1.5 md:col-span-2">
                <Label
                  htmlFor="monthlyPaymentExpectation"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                >
                  Monthly Expectation
                </Label>
                <div className="relative">
                  <div className="absolute left-1.5 top-1.5 bottom-1.5 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <IndianRupee
                      className="h-4 w-4 text-orange-500 font-bold"
                      strokeWidth={3}
                    />
                  </div>
                  <Input
                    id="monthlyPaymentExpectation"
                    type="number"
                    placeholder="Enter expected salary"
                    className="pl-12 bg-[#f8f9fa] border-0 rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    value={formData.monthlyPaymentExpectation}
                    onChange={(e) =>
                      handleInputChange(
                        "monthlyPaymentExpectation",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <p className="text-[10px] italic font-medium text-slate-400 mt-1">
                  * This helps us find relevant opportunities for you.
                </p>
              </div>
            )}
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
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto px-10 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-none transition-all hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? "Saving..." : "Next Step"}
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
