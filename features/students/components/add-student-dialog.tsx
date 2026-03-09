"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  Users,
  Baby,
  BookOpen,
  Loader2,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import studentService from "../api.service";
import profileService from "../../profile/api.service";
import authService from "../../auth/api.service";
import courseService from "../course.service";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CompleteProfilePopup from "@/components/CompleteProfilePopup";
import { JoinNowPopup } from "@/components/JoinNowPopup";
import { AddBatchDialog } from "../../batches/components/add-batch-dialog";

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  fathers_name: z
    .string()
    .min(2, "Father's name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().min(1, "Date of birth is required"),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  school_name: z.string().min(2, "School name is required"),
  class: z.string().min(1, "Class is required"),
  category_id: z.string().min(1, "Category is required"),
  course_id: z.string().min(1, "Course is required"),
  batch_id: z.string().min(1, "Batch is required"),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface AddStudentDialogProps {
  onSuccess?: () => void;
}

export function AddStudentDialog({ onSuccess }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showJoinNowModal, setShowJoinNowModal] = useState(false);
  const { user: currentUser, status } = useAuth();
  const router = useRouter();

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      fathers_name: "",
      gender: undefined,
      dob: "",
      mobile: "",
      email: "",
      school_name: "",
      class: "",
      category_id: "",
      course_id: "",
      batch_id: "",
    },
  });

  const selectedCategoryId = form.watch("category_id");

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchBatchesList();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCourses(selectedCategoryId);
      form.setValue("course_id", "");
    } else {
      setCourses([]);
      form.setValue("course_id", "");
    }
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    setIsDataLoading(true);
    try {
      const response: any = await courseService.getCategories();
      setCategories(response || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchBatchesList = async () => {
    try {
      const response: any = await studentService.getBatches();
      if (response?.data?.batches) {
        setBatches(response.data.batches);
      } else if (response?.batches) {
        setBatches(response.batches);
      } else if (Array.isArray(response)) {
        setBatches(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setBatches(response.data);
      } else {
        setBatches([]);
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  const fetchCourses = async (categoryId: string) => {
    setIsDataLoading(true);
    try {
      const response: any = await courseService.getCourses(categoryId);
      setCourses(response || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const email = form.getValues("email");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address first");
      return;
    }

    setIsVerifyingEmail(true);
    try {
      const response: any = await studentService.sendOtp({
        email,
        event: "email-verify",
      });
      if (response?.verification) {
        setVerificationId(response.verification.id);

        if (response.verification.is_verified) {
          setIsEmailVerified(true);
          toast.success("Email is already verified!");
        } else {
          toast.success(
            response.message || "Verification code sent to " + email,
          );
          setShowOtpModal(true);
          setResendCooldown(60);
        }
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to send OTP");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    if (!verificationId) {
      toast.error("Verification ID not found. Please resend OTP.");
      return;
    }

    setIsVerifyingEmail(true);
    try {
      const email = form.getValues("email");
      await studentService.verifyOtp({
        verification_id: verificationId,
        otp: otpValue,
        email: email,
      });
      setIsEmailVerified(true);
      setShowOtpModal(false);
      toast.success("Email verified successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Invalid OTP");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsResendingOtp(true);
    try {
      const email = form.getValues("email");
      const response: any = await studentService.sendOtp({
        email,
        event: "email-verify",
      });
      if (response?.verification) {
        setVerificationId(response.verification.id);
      }
      toast.success("OTP resent successfully!");
      setResendCooldown(60);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to resend OTP");
    } finally {
      setIsResendingOtp(false);
    }
  };

  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        status: "pending",
      };
      await studentService.create(payload);
      setOpen(false);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddStudentClick = async () => {
    if (status === "pending") {
      setShowJoinNowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await profileService.getProfile();
      const user = response?.user;
      const isCompleted = user?.is_completed;

      let hasAadhar = !!(user?.aadhar?.front && user?.aadhar?.back);

      // If aadhar is not in profile response, check documents endpoint
      if (!hasAadhar) {
        const docResponse: any = await profileService.getDocuments();
        const docs = docResponse.user_documents || docResponse;
        if (Array.isArray(docs)) {
          const front = docs.find(
            (d: any) => d.document_type === "aadhar_front",
          );
          const back = docs.find((d: any) => d.document_type === "aadhar_back");
          hasAadhar = !!front && !!back;
        }
      }

      if (!isCompleted || !hasAadhar) {
        if (!hasAadhar) {
          toast.info(
            "Please upload your Aadhar documents (front & back) to add students",
          );
        } else {
          toast.info("Please complete your profile details to add students");
        }
        setShowCompleteProfileModal(true);
        return;
      }

      setOpen(true);
    } catch (error) {
      console.error("Failed to check profile completion:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleAddStudentClick}
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Student
      </Button>
      <DialogContent className="w-[70vw] sm:max-w-[800px] p-0 overflow-hidden gap-0 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 bg-gradient-to-br from-gray-50/50 to-white border-b">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Add New Student
              </DialogTitle>
              <DialogDescription className="text-gray-500 mt-1">
                Fill in the details below to add a new student to the system.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          placeholder="Enter student name"
                          disabled={
                            !isEmailVerified && form.getValues("email") !== ""
                          }
                          className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fathers_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          placeholder="Enter father's name"
                          disabled={!isEmailVerified}
                          className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEmailVerified}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all">
                          <div className="flex items-center gap-2">
                            <Baby className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select gender" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!isEmailVerified}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-gray-50/50 border-gray-200 focus:bg-white transition-all",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                            {field.value ? (
                              format(
                                parse(field.value, "yyyy-MM-dd", new Date()),
                                "PPP",
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? parse(field.value, "yyyy-MM-dd", new Date())
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : "",
                            )
                          }
                          disabled={{ after: new Date() }}
                          initialFocus
                          fromYear={1950}
                          toYear={new Date().getFullYear()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 mt-2">
                <Separator className="mb-6 bg-gray-100" />
                <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Details
                </h4>
              </div>

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile (WhatsApp)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          disabled={!isEmailVerified}
                          className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex gap-2">
                      <FormControl className="flex-1">
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            disabled={isEmailVerified}
                            className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {!isEmailVerified ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-10 border-primary/20 text-primary hover:bg-primary/5 font-medium min-w-[80px]"
                          onClick={handleSendOtp}
                          disabled={isVerifyingEmail}
                        >
                          {isVerifyingEmail ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100 h-10">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 mt-2">
                <Separator className="mb-6 bg-gray-100" />
                <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Academic Information
                </h4>
              </div>

              <FormField
                control={form.control}
                name="school_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          placeholder="Enter school name"
                          disabled={!isEmailVerified}
                          className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEmailVerified}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select class" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (cls) => (
                            <SelectItem key={cls} value={cls.toString()}>
                              Class {cls}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isDataLoading || !isEmailVerified}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select category" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        isDataLoading || !selectedCategoryId || !isEmailVerified
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select course" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem
                            key={course.id}
                            value={course.id.toString()}
                          >
                            {course.title || course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isEmailVerified}
                      >
                        <FormControl className="flex-1">
                          <SelectTrigger className="w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-10">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Select batch" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem
                              key={batch.id}
                              value={batch.id.toString()}
                            >
                              {batch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AddBatchDialog
                        onSuccess={() => fetchBatchesList()}
                        trigger={
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={!isEmailVerified}
                            className="shrink-0 h-10 w-10 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100 transition-colors"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        }
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-6 bg-gray-50/80 border-t flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isEmailVerified}
                onClick={() => {
                  if (!isEmailVerified) {
                    toast.info("Please verify email");
                  }
                }}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md transition-all min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Student"
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* OTP Verification Modal */}
        <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Email Verification
              </DialogTitle>
              <DialogDescription>
                We've sent a 6-digit verification code to{" "}
                <span className="font-semibold text-foreground">
                  {form.getValues("email")}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-6">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
                autoFocus
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 text-lg border-2"
                  />
                </InputOTPGroup>
              </InputOTP>

              <div className="text-center w-full space-y-2">
                <Button
                  className="w-full shadow-lg"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingEmail || otpValue.length !== 6}
                >
                  {isVerifyingEmail ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Verify Email"
                  )}
                </Button>
                <div className="flex justify-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary font-medium"
                    onClick={handleResendOtp}
                    disabled={isResendingOtp || resendCooldown > 0}
                  >
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend Code"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
      <CompleteProfilePopup
        open={showCompleteProfileModal}
        onOpenChange={setShowCompleteProfileModal}
      />
      <JoinNowPopup
        externalOpen={showJoinNowModal}
        onOpenChange={setShowJoinNowModal}
      />
    </Dialog>
  );
}
