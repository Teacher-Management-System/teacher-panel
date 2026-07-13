"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  PlayCircle,
  Users,
  Hammer,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function IntroducingProgramSection() {
  const pillars = [
    { text: "Recorded Lessons", icon: PlayCircle },
    { text: "Live Mentor Sessions", icon: Users },
    { text: "Practical Project Building", icon: Hammer },
    { text: "Teaching Methodology", icon: GraduationCap },
    { text: "Ready Classroom Resources", icon: BookOpen },
  ];

  return (
    <section
      id="introducing-program"
      className="py-28 relative overflow-hidden bg-slate-900 text-white"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(31,192,199,0.16),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(31,192,199,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            {/* Left: Robot mascot illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 hidden lg:flex justify-center"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/robot-mascot.svg"
                  alt="Aerophantom Robot Mascot"
                  width={340}
                  height={360}
                  className="w-full max-w-[320px] h-auto drop-shadow-[0_20px_40px_rgba(31,192,199,0.25)]"
                />
              </motion.div>
            </motion.div>

            {/* Right: Header */}
            <div className="lg:col-span-8 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Introducing The Program
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-7 leading-[1.08]">
                Aerophantom Certified <br />
                <span className="text-gradient">
                  Robotics & AI Educator Program
                </span>
              </h2>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A complete 6-week hybrid learning experience that combines
                recorded lessons, live mentor sessions, practical project
                building, teaching methodology, and ready-to-use classroom
                resources.
              </p>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center justify-center gap-3"
              >
                <span className="absolute top-3 right-4 text-xs font-bold text-white/15 group-hover:text-primary/50 transition-colors">
                  0{i + 1}
                </span>
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  {pillar.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Core Message Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 text-center max-w-3xl mx-auto overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <h4 className="text-2xl md:text-3xl font-bold mb-4">
              This is <span className="text-gradient">not just</span> a training
              course.
            </h4>
            <p className="text-slate-300 text-lg leading-relaxed">
              It's a complete preparation program that helps you confidently
              teach Robotics & AI in real classrooms.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
