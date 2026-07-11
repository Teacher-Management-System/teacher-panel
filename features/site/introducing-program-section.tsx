"use client";
import { motion } from "framer-motion";
import { Sparkles, PlayCircle, Users, Hammer, BookOpen, GraduationCap } from "lucide-react";

export default function IntroducingProgramSection() {
  const pillars = [
    { text: "Recorded Lessons", icon: PlayCircle },
    { text: "Live Mentor Sessions", icon: Users },
    { text: "Practical Project Building", icon: Hammer },
    { text: "Teaching Methodology", icon: GraduationCap },
    { text: "Ready Classroom Resources", icon: BookOpen },
  ];

  return (
    <section id="introducing-program" className="py-24 relative overflow-hidden bg-slate-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(31,192,199,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(31,192,199,0.05),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              Introducing The Program
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
              Aerophantom Certified <br />
              <span className="text-primary">Robotics & AI Educator Program</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              A complete 6-week hybrid learning experience that combines recorded lessons, live mentor sessions, practical project building, teaching methodology, and ready-to-use classroom resources.
            </p>
          </div>

          {/* Pillars List / Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all text-center flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-200">{pillar.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Core Message Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 text-center max-w-3xl mx-auto"
          >
            <h4 className="text-2xl font-bold mb-4">This is not just a training course.</h4>
            <p className="text-slate-300 text-lg leading-relaxed">
              It's a complete preparation program that helps you confidently teach Robotics & AI in real classrooms.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
