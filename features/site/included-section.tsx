"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Box, BookOpen, ScrollText, PlayCircle, Users, HardDriveUpload, CalendarRange, Award } from "lucide-react";

export default function IncludedSection() {
  const items = [
    {
      title: "Practical Hardware Kit",
      description: "Get a comprehensive physical kit with microcontrollers, breadboards, sensors, actuators, and wiring tools.",
      icon: Box,
    },
    {
      title: "Student & Teacher Curriculum",
      description: "Receive mapped learning material, standard modules, worksheets, and syllabus guides.",
      icon: BookOpen,
    },
    {
      title: "Project Manual",
      description: "A step-by-step documentation manual detailing circuit diagrams and source code explanations.",
      icon: ScrollText,
    },
    {
      title: "Recorded Video Library",
      description: "Get lifetime access to our high-definition recorded guides covering coding and hardware concepts.",
      icon: PlayCircle,
    },
    {
      title: "Live Doubt Sessions",
      description: "Connect live with mentors to debug programming errors, circuit failures, and clear concept doubts.",
      icon: Users,
    },
    {
      title: "Classroom Resources",
      description: "Ready-to-use PPT slides, project checklists, and student worksheets to use in school sessions.",
      icon: HardDriveUpload,
    },
    {
      title: "Ready Teaching Plans",
      description: "Structured roadmap planning your lectures, class timelines, and homework tasks.",
      icon: CalendarRange,
    },
    {
      title: "Official Certification",
      description: "Receive a verified certificate of completion and teaching readiness by Aerophantom.",
      icon: Award,
    },
  ];

  return (
    <section id="included" className="py-24 bg-white relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 mb-4 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Included Ecosystem
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need <br />
              <span className="text-gradient">To Start Teaching</span>
            </h2>
            <p className="text-slate-600 text-lg">
              We provide the materials, training, and curricula so you can launch hands-on technology sessions without any delay.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors flex items-start gap-2">
                    <span className="text-success text-base flex-shrink-0 mt-1">✔</span>
                    <span>{item.title}</span>
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
