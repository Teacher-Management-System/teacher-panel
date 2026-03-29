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
import { Button } from "@/components/ui/button";
import { Plus, Loader2, MapPin, CalendarDays, BookOpen, School, Calendar } from "lucide-react";
import { format, parse } from "date-fns";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import batchService from "../api.service";
import { toast } from "sonner";
import { Batch } from "../model";

const batchSchema = z.object({
  name: z.string().min(2, "Batch name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  start_date: z.string().min(1, "Start date is required"),
});

type BatchFormValues = z.infer<typeof batchSchema>;

interface AddBatchDialogProps {
  onSuccess?: () => void;
  batch?: Batch;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

// Inner form component to lazily initialize the form only when dialog is open
function AddBatchForm({ 
  batch, 
  onClose, 
  onSuccess 
}: { 
  batch?: Batch, 
  onClose: () => void, 
  onSuccess?: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: batch?.name || "",
      location: batch?.location || "",
      start_date: batch?.start_date
        ? format(
            new Date(
              typeof batch.start_date === "number"
                ? batch.start_date * 1000
                : batch.start_date,
            ),
            "yyyy-MM-dd",
          )
        : "",
    },
  });

  async function onSubmit(data: BatchFormValues) {
    setIsLoading(true);
    try {
      if (batch?.id) {
        await batchService.update(batch.id as unknown as number, data);
        toast.success("Batch updated successfully");
      } else {
        await batchService.create(data);
        toast.success("Batch created successfully");
      }
      onClose();
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        batch?.id ? "Failed to update batch" : "Failed to create batch",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 pt-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Batch Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-[14px] h-[18px] w-[18px] text-muted-foreground" />
                  <Input
                    placeholder="e.g. Morning AI Batch"
                    className="pl-11 h-12 bg-muted/50 border-border border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold text-foreground placeholder:text-muted-foreground"
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <School className="absolute left-3.5 top-[14px] h-[18px] w-[18px] text-muted-foreground" />
                  <Input
                    placeholder="e.g. Room 101 or Online"
                    className="pl-11 h-12 bg-muted/50 border-border border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold text-foreground placeholder:text-muted-foreground"
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
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Start Date</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div className="relative">
                      <Button
                        type="button"
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 px-4 text-left font-semibold bg-muted/50 border-border border-2 rounded-2xl shadow-none hover:bg-muted focus:ring-1 focus:ring-primary flex items-center justify-between transition-all",
                          !field.value && "text-muted-foreground font-normal",
                        )}
                      >
                        {field.value ? (
                          <span className="text-foreground font-semibold">{format(
                            parse(field.value, "yyyy-MM-dd", new Date()),
                            "dd - MM - yyyy"
                          )}</span>
                        ) : (
                          <span>dd - mm - yyyy</span>
                        )}
                        <CalendarDays className="h-[18px] w-[18px] text-foreground opacity-100" />
                      </Button>
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={
                      field.value
                        ? parse(field.value, "yyyy-MM-dd", new Date())
                        : undefined
                    }
                    onSelect={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="hover:bg-transparent hover:text-foreground text-muted-foreground font-bold"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_4px_14px_0_rgba(95,92,235,0.39)] rounded-2xl px-8 h-12 font-bold transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {batch ? "Updating..." : "Creating..."}
              </>
            ) : batch ? (
              "Update Batch"
            ) : (
              "Create Batch"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AddBatchDialog({
  onSuccess,
  batch,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: AddBatchDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (newOpen: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Batch
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-8 border-0 shadow-2xl rounded-[32px] overflow-hidden bg-card">
        <DialogHeader className="p-0 space-y-0 text-left flex flex-row items-center gap-4 mb-2 border-b border-border pb-6">
          <div className="h-[60px] w-[60px] bg-primary/10 rounded-[20px] flex items-center justify-center shrink-0">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-extrabold text-foreground tracking-tight">
              {batch ? "Edit Batch" : "Add New Batch"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-[13px] font-medium mt-1">
              {batch
                ? "Update the details of the batch below."
                : "Create a new course schedule."}
            </DialogDescription>
          </div>
        </DialogHeader>

        {open && (
          <AddBatchForm 
            batch={batch} 
            onClose={() => setOpen(false)} 
            onSuccess={onSuccess} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
