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
  UserPlus,
  Building2,
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
import profileService from "../../profile/aou.service";
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
  gender: z.enum(["male", "female", "other"], {
    message: "Please select gender",
  }),
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddBatchDialogOpen, setIsAddBatchDialogOpen] = useState(false);
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
      let fetchedBatches = [];
      if (response?.data?.batches) {
        fetchedBatches = response.batches;
      } else if (response?.batches) {
        fetchedBatches = response.batches;
      } else if (Array.isArray(response)) {
        fetchedBatches = response;
      } else if (response?.data && Array.isArray(response.data)) {
        fetchedBatches = response.data;
      } else {
        fetchedBatches = [];
      }
      setBatches(fetchedBatches);
      return fetchedBatches;
    } catch (error) {
      console.error("Failed to fetch batches:", error);
      return [];
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
    const email = form.getValues("email").toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
        } else {
          setShowOtpModal(true);
          setResendCooldown(60);
        }
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const submitStudentData = async (data: StudentFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        email: data.email.toLowerCase(),
        status: "pending",
      };
      await studentService.create(payload);
      setOpen(false);
      form.reset();
      setIsEmailVerified(false);
      setOtpValue("");
      setVerificationId(null);
      setResendCooldown(0);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      return;
    }
    if (!verificationId) {
      return;
    }
    setIsVerifyingEmail(true);
    try {
      const email = form.getValues("email").toLowerCase();
      await studentService.verifyOtp({
        verification_id: verificationId,
        otp: otpValue,
        email: email,
      });
      setIsEmailVerified(true);
      setShowOtpModal(false);
      setOtpValue("");

      // Auto-submit the student creation upon successful OTP verification
      await submitStudentData(form.getValues() as StudentFormValues);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsResendingOtp(true);
    try {
      const email = form.getValues("email").toLowerCase();
      const response: any = await studentService.sendOtp({
        email,
        event: "email-verify",
      });
      if (response?.verification) {
        setVerificationId(response.verification.id);
      }
      setResendCooldown(60);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsResendingOtp(false);
    }
  };

  async function onSubmit(data: StudentFormValues) {
    if (!isEmailVerified) {
      await handleSendOtp();
      return;
    }
    await submitStudentData(data);
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
      const isCompleted = user?.is_profile_completed;

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
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          form.reset();
          setIsEmailVerified(false);
          setOtpValue("");
          setVerificationId(null);
          setResendCooldown(0);
        }
      }}
    >
      <Button
        onClick={handleAddStudentClick}
        className="w-full h-10 md:h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md rounded-xl font-bold"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Student
      </Button>
      <DialogContent className="w-[95vw] sm:max-w-[600px] md:max-w-[800px] p-0 overflow-hidden gap-0 border-0 shadow-2xl rounded-2xl max-h-[96vh]">
        <DialogHeader className="p-6 pb-2 border-b-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#e6f4ea] rounded-2xl">
              <UserPlus className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Add New Student
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mt-1">
                Fill in the details to register a new student.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 px-4 md:px-6 pb-6 pt-2 max-h-[calc(96vh-180px)] overflow-y-auto custom-scrollbar">
              {/* Personal Information Section */}
              <div className="md:col-span-2 mt-2">
                <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Student Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter full name"
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-0 rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Father's Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter father's name"
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-0 rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/50 border-0 rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 text-foreground">
                          <SelectValue placeholder="Select gender" />
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
                    <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Date of Birth
                    </FormLabel>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={isLoading}
                            className={cn(
                              "w-full h-11 !h-11 px-4 text-left font-normal bg-muted/50 border-0 rounded-xl shadow-none hover:bg-muted flex justify-between text-foreground",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value && typeof field.value === "string" ? (
                              (() => {
                                try {
                                  const parsed = parse(
                                    field.value,
                                    "yyyy-MM-dd",
                                    new Date(),
                                  );
                                  if (!isNaN(parsed.getTime())) {
                                    return format(parsed, "dd-MM-yyyy");
                                  }
                                  return field.value;
                                } catch (e) {
                                  return field.value;
                                }
                              })()
                            ) : field.value ? (
                              String(field.value)
                            ) : (
                              <span>dd-mm-yyyy</span>
                            )}
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value && typeof field.value === "string"
                              ? (() => {
                                const parsed = parse(
                                  field.value,
                                  "yyyy-MM-dd",
                                  new Date(),
                                );
                                return !isNaN(parsed.getTime())
                                  ? parsed
                                  : undefined;
                              })()
                              : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : "",
                            );
                            setIsCalendarOpen(false);
                          }}
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

              <div className="md:col-span-2 mt-4">
                <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Details
                </h4>
              </div>

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Mobile (WhatsApp)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          maxLength={10}
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-0 rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Email Address
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl className="flex-1">
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            disabled={isEmailVerified || isLoading}
                            className="pl-10 bg-muted/50 border-0 rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {isEmailVerified && (
                        <div className="flex items-center gap-1.5 px-3 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100 h-11">
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

              <div className="md:col-span-2 mt-4">
                <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Academic Information
                </h4>
              </div>

              <FormField
                control={form.control}
                name="school_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      School Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter school name"
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-0 rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Class
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/50 border-0 rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 text-foreground">
                          <SelectValue placeholder="Select class" />
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isDataLoading || isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/50 border-0 rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 text-foreground">
                          <SelectValue placeholder="Select category" />
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Course
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        isDataLoading || !selectedCategoryId || isLoading
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/50 border-0 rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 text-foreground">
                          <SelectValue placeholder="Select course" />
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Batch
                    </FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(val) => {
                          if (val === "add-new-batch") {
                            setIsAddBatchDialogOpen(true);
                          } else {
                            field.onChange(val);
                          }
                        }}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl className="flex-1">
                          <SelectTrigger className="w-full bg-muted/50 border-0 rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30 text-foreground">
                            <SelectValue placeholder="Select batch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {batches.length > 0 ? (
                            batches.map((batch) => (
                              <SelectItem
                                key={batch.id}
                                value={batch.id.toString()}
                              >
                                {batch.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="add-new-batch" className="text-emerald-600 font-bold">
                              <Plus className="mr-2 h-4 w-4 inline" />
                              Add New Batch
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <AddBatchDialog
                        open={isAddBatchDialogOpen}
                        onOpenChange={setIsAddBatchDialogOpen}
                        onSuccess={async (newBatch) => {
                          const batchesList = await fetchBatchesList();
                          const batchId =
                            newBatch?.id ||
                            newBatch?.data?.id ||
                            (typeof newBatch === "string" ? newBatch : null);

                          if (batchId) {
                            // Use setTimeout to ensure the Select component has re-rendered with new batches
                            setTimeout(() => {
                              form.setValue("batch_id", batchId.toString(), {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              });
                            }, 100);
                          }
                        }}
                        trigger={
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={isLoading}
                            className="shrink-0 h-11 !h-11 w-11 !w-11 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 border-0 rounded-xl transition-colors"
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

            <div className="pt-4 md:pt-6 pb-6 px-6 bg-card flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="hover:bg-transparent hover:text-foreground text-muted-foreground font-bold w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-xl px-8 h-11 font-bold w-full sm:min-w-[140px] order-1 sm:order-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Register Student"
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* OTP Verification Modal */}
        <Dialog
          open={showOtpModal}
          onOpenChange={(val) => {
            setShowOtpModal(val);
            if (!val) {
              setOtpValue("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[440px] p-10 border-0 shadow-2xl rounded-[32px] overflow-hidden bg-card">
            <DialogHeader className="space-y-0 text-center flex flex-col items-center">
              <div className="h-[88px] w-[88px] bg-primary/10 rounded-[20px] flex items-center justify-center mb-6 mt-2">
                <ShieldCheck className="h-11 w-11 text-primary" />
              </div>
              <DialogTitle className="text-[28px] font-extrabold text-foreground mb-2 tracking-tight">
                Verify Email
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-[15px] font-medium leading-relaxed max-w-[300px] text-center">
                We've sent a 6-digit verification code to
                <br />
                <span
                  className="font-extrabold text-foreground text-[15px] mt-1.5 block truncate w-full text-center"
                  title={form.getValues("email")}
                >
                  {form.getValues("email")}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center pt-8 pb-6 w-full gap-0">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value.replace(/\D/g, ""))}
                autoFocus
              >
                <InputOTPGroup className="gap-2 sm:gap-3">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <InputOTPSlot
                      key={idx}
                      index={idx}
                      className="w-11 h-14 sm:w-12 sm:h-14 text-xl sm:text-2xl font-bold bg-muted/50 border-border border-2 rounded-[14px] shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center w-full space-y-7">
              <Button
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[16px] font-extrabold shadow-[0_8px_20px_-6px_rgba(131,233,197,0.5)] transition-all"
                onClick={handleVerifyOtp}
                disabled={isVerifyingEmail || otpValue.length !== 6}
              >
                {isVerifyingEmail ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              <div className="flex flex-col items-center justify-center gap-4">
                <Button
                  variant="link"
                  size="sm"
                  className="text-[#83e9c5] font-bold text-[14px] h-auto p-0"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend Code"}
                </Button>
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
