"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  School,
  GraduationCap,
  BookOpen,
  Loader2,
  CheckCircle2,
  UserPlus,
  Building2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import studentService from "../api.service";
import courseService from "../course.service";
import { Student } from "../model";
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

interface EditStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditStudentDialog({
  student,
  open,
  onOpenChange,
  onSuccess,
}: EditStudentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  // Load initial data
  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchBatchesList();
    }
  }, [open]);

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

  // Load courses when category changes
  useEffect(() => {
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

    if (selectedCategoryId) {
      fetchCourses(selectedCategoryId);
      // Only clear course_id if it's a manual change, not the initial pre-fill
      // But react-hook-form handles this better if we just update the values in the student effect
    } else {
      setCourses([]);
    }
  }, [selectedCategoryId]);

  // Helper to normalize DOB to yyyy-MM-dd string
  const normalizeDate = (dateVal: any) => {
    if (!dateVal) return "";
    if (typeof dateVal === "string") {
      // If it's already yyyy-MM-dd
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) return dateVal;
      // If it's a numeric string (timestamp)
      if (/^\d+$/.test(dateVal)) {
        try {
          return format(new Date(Number(dateVal) * 1000), "yyyy-MM-dd");
        } catch (e) {
          return "";
        }
      }
      return dateVal;
    }
    if (typeof dateVal === "number") {
      try {
        return format(new Date(dateVal * 1000), "yyyy-MM-dd");
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  // Load student data when dialog opens
  useEffect(() => {
    if (student && open) {
      form.reset({
        name: student.name,
        fathers_name: student.fathers_name || "",
        email: student.email,
        mobile: student.mobile,
        gender: student.gender || "male",
        dob: normalizeDate(student.dob),
        school_name: student.school_name || "",
        class: student.class?.toString() || "",
        category_id:
          (student.category?.id || student.category_id)?.toString() || "",
        course_id: (student.course?.id || student.course_id)?.toString() || "",
        batch_id: (student.batch?.id)?.toString() || "",
      });
    }
  }, [student, open, form]);

  async function onSubmit(data: StudentFormValues) {
    if (!student) return;

    setIsLoading(true);
    try {
      await studentService.update(student.id, data);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70vw] sm:max-w-[800px] p-0 overflow-hidden gap-0 border border-border shadow-2xl rounded-2xl bg-card">
        <DialogHeader className="p-6 pb-2 border-b-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <UserPlus className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Edit Student
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mt-1">
                Update the details of the student. Email cannot be changed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 px-6 pb-6 pt-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Personal Information Section */}
              <div className="md:col-span-2 mt-2">
                <h4 className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Student Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                        <Input
                          placeholder="Enter full name"
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-border rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Father's Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                        <Input
                          placeholder="Enter father's name"
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-border rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/50 border-border rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30">
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
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
                              "w-full h-11 !h-11 px-4 text-left font-normal bg-muted/50 border-border rounded-xl shadow-none hover:bg-muted flex justify-between",
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
                            <CalendarDays className="h-4 w-4 text-muted-foreground/40" />
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
                <h4 className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Details
                </h4>
              </div>

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Mobile (WhatsApp)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          maxLength={10}
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-border rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/30" />
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          disabled={true}
                          className="pl-10 bg-muted border-border rounded-xl h-11 !h-11 shadow-none cursor-not-allowed opacity-70"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 mt-4">
                <h4 className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Academic Information
                </h4>
              </div>

              <FormField
                control={form.control}
                name="school_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      School Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/40" />
                        <Input
                          placeholder="Enter school name"
                          disabled={isLoading}
                          className="pl-10 bg-muted/50 border-border rounded-xl h-11 !h-11 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
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
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isDataLoading || isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/50 border-border rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30">
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
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Class
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/50 border-border rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30">
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
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
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
                        <SelectTrigger className="w-full bg-muted/50 border-border rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30">
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Batch
                    </FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl className="flex-1">
                          <SelectTrigger className="w-full bg-muted/50 border-border rounded-xl h-11 !h-11 px-4 shadow-none focus:ring-1 focus:ring-primary/30">
                            <SelectValue placeholder="Select batch" />
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
                            disabled={isLoading}
                            className="shrink-0 h-11 !h-11 w-11 !w-11 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-600 border border-emerald-500/20 rounded-xl transition-colors"
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

            <div className="pt-6 pb-6 px-6 bg-card flex justify-end gap-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="hover:bg-transparent hover:text-foreground text-muted-foreground font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#85e0c5] hover:bg-[#76cca8] text-white shadow-sm rounded-xl px-8 h-11 font-bold min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
