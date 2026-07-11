"use client";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "What are the prerequisites to enroll in this program?",
      answer: "No prior coding or electronics background is required. The curriculum starts from absolute fundamentals of circuitry and block programming, making it highly accessible to any educator.",
    },
    {
      question: "How does the hybrid learning model work?",
      answer: "You get lifetime access to pre-recorded video lectures that you can study at your own convenience. Every week, we hold live mentor-led sessions to troubleshoot code, review circuits, and clear conceptual doubts.",
    },
    {
      question: "Will I receive physical hardware kits for practice?",
      answer: "Yes! A practical hardware kit containing microcontrollers, various sensors, motor drivers, servo motors, breadboard, chassis, and wiring components is shipped directly to your address upon enrollment.",
    },
    {
      question: "Is the certification official and verified?",
      answer: "Yes, you will receive an official Aerophantom Certified Robotics & AI Educator certification. It features a unique credential ID that schools or coaching centers can verify directly on our portal.",
    },
    {
      question: "What resource materials do I get to start teaching my own classes?",
      answer: "We provide complete student worksheets, teacher guides, structured lecture plans, presentation slides (PPTs), project reference guides, and promotional templates for local marketing.",
    },
    {
      question: "What is the duration of the training program?",
      answer: "The program is structured over 6 weeks. Each week covers a dedicated curriculum milestones, culminating in a week dedicated entirely to teaching methodologies and classroom deployment.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -ml-40" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -mr-40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 mb-4 shadow-sm">
              <HelpCircle className="w-4 h-4 text-primary" /> Common Questions
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked <br />
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-slate-600 text-lg">
              Have doubts about the kit, curriculum, or live mentoring? Find quick answers below.
            </p>
          </div>

          {/* Accordion container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm"
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="bg-white px-6 rounded-2xl border border-slate-200/60 shadow-sm hover:border-primary/20 transition-colors"
                >
                  <AccordionTrigger className="text-base md:text-lg font-bold text-slate-900 py-5 hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-base leading-relaxed pb-5 border-t border-slate-100 pt-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
