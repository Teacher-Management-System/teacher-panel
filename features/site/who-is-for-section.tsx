"use client";
import { motion } from "framer-motion";
import {
  School,
  Presentation,
  GraduationCap,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function WhoIsForSection() {
  const audiences = [
    {
      title: "School Teachers",
      description:
        "Upgrade your teaching skills and confidently conduct Robotics & AI classes in your school.",
      icon: School,
      tag: "🏫 School",
      accent: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
      ring: "hover:border-teal-500/40",
    },
    {
      title: "Existing Robotics Trainers",
      description:
        "Strengthen your technical concepts, improve classroom delivery, and access a structured curriculum.",
      icon: Presentation,
      tag: "👨‍🏫 Trainer",
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
      ring: "hover:border-blue-500/40",
    },
    {
      title: "Aspiring Educators",
      description:
        "Build a strong foundation and start your career in Robotics & AI education.",
      icon: GraduationCap,
      tag: "🎓 Aspiring",
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
      ring: "hover:border-purple-500/40",
    },
    {
      title: "STEM Trainers",
      description:
        "Expand your offerings with future-ready technology programs.",
      icon: Building2,
      tag: "🏢 Trainers",
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      ring: "hover:border-amber-500/40",
    },
  ];

  return (
    <section
      id="who-is-for"
      className="py-14 bg-background relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-dot-pattern opacity-25 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 mb-5">
              Target Audience
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              Designed for Every{" "}
              <span className="text-gradient">Educator Ready to Grow</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              No matter your starting point or background, our hybrid ecosystem
              is built to scale your knowledge and teaching confidence.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {audiences.map((aud, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group p-8 md:p-9 rounded-[2rem] bg-card border border-border/60 hover:shadow-[0_24px_60px_-20px_rgba(31,192,199,0.3)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden ${aud.ring}`}
              >
                {/* Corner glow */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/[0.07] rounded-full blur-2xl group-hover:bg-primary/[0.14] transition-colors" />

                <div className="relative flex flex-col sm:flex-row items-start gap-6">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ${aud.accent}`}
                  >
                    <aud.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3.5">
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground border border-border">
                      {aud.tag}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {aud.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {aud.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      This program is for you{" "}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
