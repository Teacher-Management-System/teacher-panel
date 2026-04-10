"use client";

import { useState } from "react";
import Navbar from "@/features/site/navbar";
import Footer from "@/features/site/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import inquiryService from "../api.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  text: z.string().min(10, "Your message must be at least 10 characters"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export default function Inquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      text: "",
    },
  });

  const onSubmit = async (values: InquiryFormValues) => {
    setIsSubmitting(true);
    try {
      await inquiryService.store(values);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24 pb-16 bg-zinc-50 dark:bg-zinc-950">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Inquiry Received!
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-10 leading-relaxed">
                Thank you for your interest in Aerophantom. Our educator support
                team has received your request and will get back to you within
                24-48 business hours.
              </p>
              <Button asChild size="lg" className="rounded-xl px-10">
                <a href="/">Return to Home</a>
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-30 pb-16 bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="container mx-auto max-w-[1200px]">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Content: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-8 lg:sticky lg:top-32"
            >
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Let's Start Your Robotics Center
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg lg:text-lg leading-relaxed">
                  Fill out the form to inquire about our Educator Training
                  Program. We'll provide you with all the details needed to
                  launch your own successful training center.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Building2,
                    title: "Official Support",
                    desc: "Complete academic and business guidance.",
                  },
                  {
                    icon: GraduationCap,
                    title: "Certified Program",
                    desc: "Official training and certification for educators.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Growth Oriented",
                    desc: "Proven model to help you scale your center.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-5 md:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Content: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 bg-white dark:bg-zinc-900 shadow-2xl rounded-[40px] p-8 md:p-12 lg:p-16 border border-zinc-200 dark:border-zinc-800"
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-bold mb-2 text-[#0f3444] dark:text-slate-200">
                            <User className="w-5 h-5 text-[#00bdae]" /> Full
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-0 ring-1 ring-inset ring-zinc-100 dark:ring-zinc-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white h-[60px] text-[15px] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-bold mb-2 text-[#0f3444] dark:text-slate-200">
                            <Mail className="w-5 h-5 text-[#00bdae]" /> Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-0 ring-1 ring-inset ring-zinc-100 dark:ring-zinc-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white h-[60px] text-[15px] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Mobile */}
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-bold mb-2 text-[#0f3444] dark:text-slate-200">
                          <Phone className="w-5 h-5 text-[#00bdae]" /> Mobile
                          Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your 10-digit mobile number"
                            className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-0 ring-1 ring-inset ring-zinc-100 dark:ring-zinc-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white h-[60px] text-[15px] px-6"
                            max={10}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 10) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Question */}
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold mb-2 text-[#0f3444] dark:text-slate-200 block">
                          Write your question here
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a bit about your interests or ask anything..."
                            className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-0 ring-1 ring-inset ring-zinc-100 dark:ring-zinc-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white min-h-[140px] resize-none px-6 py-5 text-[15px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30 gradient-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Submit Inquiry
                      </div>
                    )}
                  </Button>

                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    By submitting, you agree to our{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
