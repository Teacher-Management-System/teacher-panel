"use client";

import { useState } from "react";
import Navbar from "@/features/site/navbar";
import Footer from "@/features/site/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

export default function InquiryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success(
      "Inquiry submitted successfully! Our team will contact you soon.",
    );
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
      <main className="flex-grow pt-24 pb-16 bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 lg:sticky lg:top-32"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Let's Start Your Robotics Center
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
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
                    className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
              className="bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 md:p-10 border border-zinc-200 dark:border-zinc-800"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      required
                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-12"
                    />
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-12"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    placeholder="Enter your 10-digit mobile number"
                    required
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 h-12"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4 text-primary" /> Country
                    </Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      required
                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-12"
                    />
                  </div>
                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> State
                    </Label>
                    <Input
                      id="state"
                      placeholder="State"
                      required
                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-12"
                    />
                  </div>
                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> City
                    </Label>
                    <Input
                      id="city"
                      placeholder="City"
                      required
                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-12"
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <Label htmlFor="question">Write your question here</Label>
                  <Textarea
                    id="question"
                    placeholder="Tell us a bit about your interests or ask anything..."
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 min-h-[120px] resize-none p-4"
                    required
                  />
                </div>

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
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
