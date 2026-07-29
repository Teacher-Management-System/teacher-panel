"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  School,
  Milestone,
  Trophy,
  UserCheck,
  Flame,
  Compass,
} from "lucide-react";

export default function PostProgramSection() {
  const pathways = [
    {
      title: "Conduct Robotics & AI classes in schools",
      description:
        "Directly manage and lead advanced robotics classes and labs in primary and secondary schools.",
      icon: School,
    },
    {
      title: "Teach project-based STEM education",
      description:
        "Deliver active learning STEM classes using standard curriculum formats, assessments, and projects.",
      icon: Milestone,
    },
    {
      title: "Improve your professional teaching profile",
      description:
        "Distinguish your profile and gain professional advantage with an in-demand, niche skill set.",
      icon: Trophy,
    },
    {
      title: "Deliver practical technology workshops",
      description:
        "Conduct independent weekend bootcamps, workshops, and science camps for school kids.",
      icon: UserCheck,
    },
    {
      title: "Mentor students through innovation projects",
      description:
        "Inspire kids to build project submissions for science fairs, hackathons, and national competitions.",
      icon: Flame,
    },
    {
      title: "Part of Aerophantom's educator ecosystem",
      description:
        "Get placement opportunities, training materials, client leads, and complete technical backend support.",
      icon: Compass,
    },
  ];

  return (
    <section
      id="post-program"
      className="py-14 bg-white relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-dot-pattern opacity-25 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 mb-5 shadow-sm">
              Future Pathways
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
              Where Can This{" "}
              <span className="text-gradient">Training Program Take You?</span>
            </h2>
            <p className="text-slate-600 text-lg">
              After completing the program, you'll be prepared to transition
              into high-growth educational roles and build a unique teaching
              brand.
            </p>
          </div>

          {/* Pathway Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathways.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-primary/40 hover:bg-white transition-all duration-300 hover:shadow-[0_24px_60px_-20px_rgba(31,192,199,0.3)] hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Route line decoration */}
                <svg
                  className="absolute top-0 right-0 w-28 h-28 text-primary/[0.08] group-hover:text-primary/[0.16] transition-colors"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <path
                    d="M100 10H60l-16 16v30l-20 20H0"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <circle cx="60" cy="10" r="5" fill="currentColor" />
                </svg>

                <div className="relative flex items-center gap-4 mb-5">
                  <div className="w-13 h-13 p-3 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-display text-3xl font-bold text-slate-200 group-hover:text-primary/25 transition-colors select-none ml-auto">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="relative text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="relative text-slate-600 text-sm leading-relaxed mb-5">
                  {item.description}
                </p>

                <div className="relative flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  Unlock this pathway <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
