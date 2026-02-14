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
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="p-2 bg-white rounded-md shadow-sm">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[600px] p-0 overflow-hidden gap-0 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 bg-gradient-to-br from-indigo-50/50 to-white border-b">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm">
              <span className="text-lg font-bold text-indigo-600">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {student.name}
              </DialogTitle>
              <DialogDescription className="text-gray-500 mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    student.status === "active"
                      ? "bg-green-100 text-green-800"
                      : student.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
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
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  icon={User}
                  label="Father's Name"
                  value={student.fathers_name}
                />
                <DetailItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={student.dob}
                />
                <DetailItem icon={User} label="Gender" value={student.gender} />
              </div>
            </section>

            <Separator />

            {/* Contact Details */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                  label="Level"
                  value={student.level ? `Level ${student.level}` : null}
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

        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
