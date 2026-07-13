"use client";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQSection() {
  const faqs = [
    {
      question: "What are the prerequisites to enroll in this program?",
      answer:
        "No prior coding or electronics background is required. The curriculum starts from absolute fundamentals of circuitry and block programming, making it highly accessible to any educator.",
    },
    {
      question: "How does the hybrid learning model work?",
      answer:
        "You get lifetime access to pre-recorded video lectures that you can study at your own convenience. Every week, we hold live mentor-led sessions to troubleshoot code, review circuits, and clear conceptual doubts.",
    },
    {
      question: "Will I receive physical hardware kits for practice?",
      answer:
        "Yes! A practical hardware kit containing microcontrollers, various sensors, motor drivers, servo motors, breadboard, chassis, and wiring components is shipped directly to your address upon enrollment.",
    },
    {
      question: "Is the certification official and verified?",
      answer:
        "Yes, you will receive an official Aerophantom Certified Robotics & AI Educator certification. It features a unique credential ID that schools or coaching centers can verify directly on our portal.",
    },
    {
      question:
        "What resource materials do I get to start teaching my own classes?",
      answer:
        "We provide complete student worksheets, teacher guides, structured lecture plans, presentation slides (PPTs), project reference guides, and promotional templates for local marketing.",
    },
    {
      question: "What is the duration of the training program?",
      answer:
        "The program is structured over 6 weeks. Each week covers a dedicated curriculum milestones, culminating in a week dedicated entirely to teaching methodologies and classroom deployment.",
    },
  ];

  return (
    <section id="faq" className="py-28 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -ml-40" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left sticky header + help card */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-7">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm">
                  <HelpCircle className="w-4 h-4 text-primary" /> Common
                  Questions
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Frequently Asked{" "}
                  <span className="text-gradient">Questions</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Have doubts about the kit, curriculum, or live mentoring?
                  Find quick answers here.
                </p>

                {/* Still have questions card */}
                <div className="relative p-7 rounded-3xl bg-slate-950 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(31,192,199,0.3),transparent_60%)]" />
                  <div className="relative space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold">Still have questions?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Our team is happy to walk you through the program, kit,
                      and certification details.
                    </p>
                    <Button
                      variant="default"
                      asChild
                      className="rounded-xl shadow-lg shadow-primary/30 w-full"
                    >
                      <Link href="tel:+919509206534">
                        <PhoneCall className="w-4 h-4 mr-2" /> Talk to Our Team
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8"
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    className="group bg-slate-50 px-6 md:px-8 rounded-2xl border border-slate-200/60 hover:border-primary/30 data-[state=open]:border-primary/40 data-[state=open]:bg-white data-[state=open]:shadow-[0_16px_40px_-20px_rgba(31,192,199,0.35)] transition-all"
                  >
                    <AccordionTrigger className="text-base md:text-lg font-bold text-slate-900 py-5 hover:no-underline hover:text-primary transition-colors text-left gap-4">
                      <span className="flex items-start gap-4">
                        <span className="font-display text-primary/40 group-data-[state=open]:text-primary transition-colors shrink-0">
                          0{idx + 1}
                        </span>
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-base leading-relaxed pb-6 md:pl-10">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
