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
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Building2,
  DollarSign,
  UserCircle,
  Users,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentReminderDialog from "@/components/PaymentReminderDialogProps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
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
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
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
        className="space-y-8 animate-in fade-in duration-500"
      >
        {/* Personal Details Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <UserCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Personal Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  className="pl-9 bg-background/50 focus:bg-background transition-colors"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fatherName"
                  placeholder="Enter your father's name"
                  className="pl-9 bg-background/50 focus:bg-background transition-colors"
                  value={formData.fatherName}
                  onChange={(e) =>
                    handleInputChange("fatherName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                className="grid grid-cols-3 gap-4"
              >
                {["Male", "Female", "Other"].map((gender) => (
                  <Label
                    key={gender}
                    htmlFor={gender.toLowerCase()}
                    className={cn(
                      "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                      formData.gender === gender.toLowerCase()
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent border border-input shadow-sm",
                    )}
                  >
                    <RadioGroupItem
                      value={gender.toLowerCase()}
                      id={gender.toLowerCase()}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{gender}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full px-3 justify-start text-left font-normal bg-background/50",
                      !formData.dob && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formData.dob ? (
                      format(formData.dob, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dob}
                    onSelect={(date) => handleInputChange("dob", date)}
                    initialFocus
                    fromYear={1950}
                    toYear={new Date().getFullYear()}
                    captionLayout="dropdown"
                    classNames={{
                      caption_label: "hidden",
                      caption_dropdowns: "flex gap-2 p-2",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Phone className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="Enter your contact number"
                  className="pl-9 bg-background/50 focus:bg-background transition-colors"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    handleInputChange("contactNumber", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-9 bg-background/50 focus:bg-background transition-colors"
                  value={formData.email}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
        </section>

        {/* Professional Info Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Education & Work
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Select
                value={formData.qualification}
                onValueChange={(value: Qualification) =>
                  handleInputChange("qualification", value)
                }
              >
                <SelectTrigger className="w-full bg-background/50">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select your qualification" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Under Graduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="postgraduate">Post Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Current Status</Label>
              <RadioGroup
                value={formData.currentStatus}
                onValueChange={(value: CurrentStatus) =>
                  handleInputChange("currentStatus", value)
                }
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {[
                  {
                    value: "college_student",
                    label: "College Student",
                    icon: GraduationCap,
                  },
                  { value: "employed", label: "Employed", icon: Briefcase },
                  {
                    value: "unemployed",
                    label: "Unemployed",
                    icon: AlertCircle,
                  },
                ].map((status) => (
                  <Label
                    key={status.value}
                    htmlFor={status.value}
                    className={cn(
                      "flex items-center justify-start gap-3 rounded-xl border p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                      formData.currentStatus === status.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-input bg-card shadow-sm",
                    )}
                  >
                    <RadioGroupItem
                      value={status.value}
                      id={status.value}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        formData.currentStatus === status.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <status.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{status.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Conditional Fields with Animation */}
            <div className="min-h-[100px]">
              {formData.currentStatus === "college_student" && (
                <Card className="border-dashed border-primary/20 bg-primary/5 animate-in slide-in-from-top-4 duration-300">
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="collegeName">College Name</Label>
                      <Input
                        id="collegeName"
                        placeholder="College Name"
                        className="bg-background"
                        value={formData.collegeName}
                        onChange={(e) =>
                          handleInputChange("collegeName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        placeholder="Course Name"
                        className="bg-background"
                        value={formData.course}
                        onChange={(e) =>
                          handleInputChange("course", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(v) => handleInputChange("year", v)}
                      >
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue placeholder="Select Year" />
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
                  </CardContent>
                </Card>
              )}

              {formData.currentStatus === "employed" && (
                <Card className="border-dashed border-primary/20 bg-primary/5 animate-in slide-in-from-top-4 duration-300">
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="organizationName"
                          placeholder="Organization Name"
                          className="pl-9 bg-background"
                          value={formData.organizationName}
                          onChange={(e) =>
                            handleInputChange(
                              "organizationName",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="designation"
                          placeholder="Designation"
                          className="pl-9 bg-background"
                          value={formData.designation}
                          onChange={(e) =>
                            handleInputChange("designation", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.currentStatus === "unemployed" && (
                <Card className="border-dashed border-primary/20 bg-primary/5 animate-in slide-in-from-top-4 duration-300">
                  <CardContent className="pt-6">
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="monthlyPaymentExpectation">
                        Monthly Payment Expectation
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="monthlyPaymentExpectation"
                          type="number"
                          placeholder="0.00"
                          className="pl-9 bg-background"
                          value={formData.monthlyPaymentExpectation}
                          onChange={(e) =>
                            handleInputChange(
                              "monthlyPaymentExpectation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
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
