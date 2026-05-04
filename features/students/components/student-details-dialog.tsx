"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  School,
  GraduationCap,
  BookOpen,
  Layout,
  Hash,
} from "lucide-react";
import { Student } from "../model";

interface StudentDetailsDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({
  student,
  open,
  onOpenChange,
}: StudentDetailsDialogProps) {
  if (!student) return null;

  const DetailItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | undefined | null;
  }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden">
      <div className="p-2 bg-card rounded-md shadow-sm border border-border shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
        <p
          className="text-sm font-medium text-foreground mt-0.5 truncate"
          title={value || ""}
        >
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[600px] p-0 overflow-hidden gap-0 border border-border shadow-2xl rounded-2xl bg-card">
        <DialogHeader className="p-6 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center border-4 border-card shadow-sm">
              <span className="text-lg font-bold text-indigo-500">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {student.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    student.status === "active"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : student.status === "pending"
                        ? "bg-amber-500/10 text-amber-500"
                        : student.status === "complete" ||
                            student.status === "completed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  {student.status}
                </span>
                <span>•</span>
                <span>Student Details</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {/* Personal Information */}
            <section>
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  icon={Hash}
                  label="Student ID"
                  value={student.student_id}
                />
                <DetailItem
                  icon={User}
                  label="Father's Name"
                  value={student.fathers_name}
                />
                <DetailItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={
                    student.dob
                      ? isNaN(Number(student.dob))
                        ? student.dob
                        : new Date(
                            Number(student.dob) * 1000,
                          ).toLocaleDateString()
                      : "Not provided"
                  }
                />
                <DetailItem icon={User} label="Gender" value={student.gender} />
              </div>
            </section>

            <Separator />

            {/* Contact Details */}
            <section>
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-500" />
                Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  icon={Mail}
                  label="Email Address"
                  value={student.email}
                />
                <DetailItem
                  icon={Phone}
                  label="Phone Number"
                  value={student.mobile}
                />
              </div>
            </section>

            <Separator />

            {/* Academic Information */}
            <section>
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <School className="h-4 w-4 text-indigo-500" />
                Academic Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  icon={School}
                  label="School Name"
                  value={student.school_name}
                />
                <DetailItem
                  icon={GraduationCap}
                  label="Class"
                  value={student.class ? `Class ${student.class}` : null}
                />
                <DetailItem
                  icon={BookOpen}
                  label="Category"
                  // @ts-ignore
                  value={
                    Array.isArray(student.category)
                      ? student.category[0]?.name || "-"
                      : student.category?.name || student.category || "-"
                  }
                />
                <DetailItem
                  icon={BookOpen}
                  label="Course"
                  // @ts-ignore
                  value={
                    student.course?.title ||
                    student.course?.name ||
                    student.course ||
                    "Not provided"
                  }
                />
                <DetailItem
                  icon={Layout}
                  label="Batch"
                  value={student.batch?.name || "Not provided"}
                />
              </div>
            </section>

            <Separator />
            <section>
              <div className="flex justify-end">
                <p className="text-xs text-muted-foreground">
                  Joined on{" "}
                  {new Date(
                    Number(student.created_at || 0) * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
