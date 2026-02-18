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
  Calendar,
  School,
  GraduationCap,
  Users,
  Baby,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import studentService from "../api.service";
import profileService from "../../profile/api.service";
import courseService from "../course.service";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { isPendingOrInactive } = useAuth();
  const router = useRouter();

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
    },
  });

  const selectedCategoryId = form.watch("category_id");

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCourses(selectedCategoryId);
      // Reset course when category changes
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
    setIsLoading(true);
    try {
      const response = await profileService.getProfile();
      const isCompleted = response?.user?.is_completed;

      if (!isCompleted) {
        toast.info("Please complete your profile to add students");
        router.push("/profile");
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
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          type="date"
                          className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
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
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
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
                      disabled={isDataLoading}
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
                      disabled={isDataLoading || !selectedCategoryId}
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
                disabled={isLoading}
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
      </DialogContent>
    </Dialog>
  );
}
