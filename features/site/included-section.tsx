"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle2,
  Box,
  BookOpen,
  ScrollText,
  PlayCircle,
  Users,
  HardDriveUpload,
  CalendarRange,
  Award,
} from "lucide-react";

export default function IncludedSection() {
  const items = [
    {
      title: "Student & Teacher Curriculum",
      description:
        "Receive mapped learning material, standard modules, worksheets, and syllabus guides.",
      icon: BookOpen,
    },
    {
      title: "Project Manual",
      description:
        "A step-by-step documentation manual detailing circuit diagrams and source code explanations.",
      icon: ScrollText,
    },
    {
      title: "Recorded Video Library",
      description:
        "Get lifetime access to our high-definition recorded guides covering coding and hardware concepts.",
      icon: PlayCircle,
    },
    {
      title: "Live Doubt Sessions",
      description:
        "Connect live with mentors to debug programming errors, circuit failures, and clear concept doubts.",
      icon: Users,
    },
    {
      title: "Classroom Resources",
      description:
        "Ready-to-use PPT slides, project checklists, and student worksheets to use in school sessions.",
      icon: HardDriveUpload,
    },
    {
      title: "Ready Teaching Plans",
      description:
        "Structured roadmap planning your lectures, class timelines, and homework tasks.",
      icon: CalendarRange,
    },
    {
      title: "Official Certification",
      description:
        "Receive a verified certificate of completion and teaching readiness by Aerophantom.",
      icon: Award,
    },
  ];

  return (
    <section id="included" className="py-14 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 mb-5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Included
              Ecosystem
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
              Everything You Need{" "}
              <span className="text-gradient">To Start Teaching</span>
            </h2>
            <p className="text-slate-600 text-lg">
              We provide the materials, training, and curricula so you can
              launch hands-on technology sessions without any delay.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Featured Kit Card with generated illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative sm:col-span-2 lg:row-span-2 p-8 rounded-[2rem] bg-slate-950 text-white border border-slate-800 overflow-hidden flex flex-col justify-between min-h-[340px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(31,192,199,0.2),transparent_60%)]" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-5">
                  <Box className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Practical Hardware Kit{" "}
                  <span className="text-gradient">Shipped to You</span>
                </h3>
                <p className="text-slate-300 leading-relaxed max-w-md">
                  A comprehensive physical kit with microcontrollers,
                  breadboards, sensors, actuators, and wiring tools — delivered
                  to your doorstep.
                </p>
              </div>
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative mt-6 self-center w-full"
              >
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm p-1.5 shadow-2xl">
                  <Image
                    src="/kit.png"
                    alt="Aerophantom STEM Hardware Kit"
                    width={520}
                    height={380}
                    className="w-full h-auto object-cover rounded-xl transform hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>

            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative p-6 rounded-[1.75rem] bg-slate-50 border border-slate-100 hover:border-primary/40 hover:bg-white transition-all duration-300 hover:shadow-[0_16px_40px_-16px_rgba(31,192,199,0.35)] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success/70 group-hover:text-success transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
