"use client";
import { motion } from "framer-motion";
import {
  Rocket,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

const OpportunitySection = () => {
  const insightCards = [
    { text: "AI & ML Everywhere", icon: Users, stat: "Every Industry" },
    { text: "Robotics in Classrooms", icon: Target, stat: "NEP Aligned" },
    { text: "Hands-on Future Skills", icon: BookOpen, stat: "Project-Based" },
    { text: "Confidence to Teach", icon: Lightbulb, stat: "Mentor Backed" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="opportunity"
      className="py-28 bg-slate-50 relative overflow-hidden"
    >
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mb-64" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-primary font-bold text-xs uppercase tracking-widest border border-primary/10 shadow-sm mb-6">
              <Rocket className="w-4 h-4 text-primary" />
              Education is Changing
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Education is Changing. <br />
              <span className="text-gradient">
                Are We Preparing Students for the Future?
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left narrative */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="relative pl-6 border-l-4 border-primary/60 space-y-5 text-lg text-slate-600 leading-relaxed">
                <p className="text-xl font-semibold text-slate-900">
                  Technology is no longer limited to engineering colleges or
                  large industries.
                </p>
                <p>
                  Artificial Intelligence, Robotics, Automation, and Smart
                  Technologies are becoming part of every industry and every
                  career.
                </p>
                <p className="text-base text-slate-500">
                  As schools adopt Robotics, AI, and STEM education, one of the
                  biggest challenges is delivering these subjects in a
                  structured and age-appropriate way. From selecting the right
                  projects and hardware to planning a progressive curriculum,
                  educators need a clear teaching framework. Aerophantom bridges
                  this gap through a comprehensive teacher training program,
                  ready curriculum, and hands-on learning resources.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Emerging AI & Robotics modules in school curricula",
                  "High demand for teachers with tech competency",
                  "Need for hands-on, project-based teaching skills",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-semibold text-slate-800">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right insight cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {insightCards.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`group relative p-7 rounded-3xl bg-white border border-slate-200/60 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(31,192,199,0.25)] hover:-translate-y-1.5 overflow-hidden ${
                    index % 2 === 1 ? "sm:translate-y-6" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg leading-snug mb-2">
                      {item.text}
                    </h4>
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {item.stat}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunitySection;
