"use client";
import { motion } from "framer-motion";
import { Cpu, Zap, Radio, Sliders, Milestone, GraduationCap } from "lucide-react";

export default function LearningJourneySection() {
  const steps = [
    {
      week: "Week 1",
      title: "Electronics Fundamentals",
      description: "Dive into basic circuitry, voltage, current, breadboard usage, resistors, and standard components.",
      icon: Zap,
      color: "from-amber-500 to-yellow-500 bg-amber-500/10 text-amber-500",
    },
    {
      week: "Week 2",
      title: "Arduino & Programming",
      description: "Master the Arduino IDE, writing code, using loops, variables, functions, and logic building.",
      icon: Cpu,
      color: "from-blue-500 to-cyan-500 bg-blue-500/10 text-blue-500",
    },
    {
      week: "Week 3",
      title: "Sensors & Interfacing",
      description: "Interface real sensors including IR sensors, ultrasonic sensors, temperature, and light sensors.",
      icon: Radio,
      color: "from-purple-500 to-indigo-500 bg-purple-500/10 text-purple-500",
    },
    {
      week: "Week 4",
      title: "Automation & Smart Systems",
      description: "Learn smart control systems, relay switches, motor drivers, buzzers, and automated response logic.",
      icon: Sliders,
      color: "from-pink-500 to-rose-500 bg-pink-500/10 text-pink-500",
    },
    {
      week: "Week 5",
      title: "Robotics Projects",
      description: "Integrate everything to assemble and code complex robots like obstacle-avoiding cars and smart setups.",
      icon: Milestone,
      color: "from-teal-500 to-emerald-500 bg-teal-500/10 text-teal-500",
    },
    {
      week: "Week 6",
      title: "Teaching Methodology & Classroom Delivery",
      description: "Learn how to structure lesson plans, troubleshoot code in classrooms, explain concepts, and assess students.",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-500 bg-emerald-500/10 text-emerald-500",
    },
  ];

  return (
    <section id="journey" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 -ml-48" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 -mr-48" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 mb-4">
              Learning Journey
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Your 6-Week Structured <br />
              <span className="text-gradient">Learning Roadmap</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Move step-by-step from core electronics concepts to teaching methodologies that fit real school classrooms.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-accent to-primary/20 rounded-full -translate-x-[1.5px]" />

            {/* Timeline Nodes */}
            <div className="space-y-16">
              {steps.map((step, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
                    {/* Circle Node */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className={`w-[60px] h-[60px] rounded-full border-4 border-slate-950 flex items-center justify-center shadow-lg ${step.color}`}
                      >
                        <step.icon className="w-6 h-6" />
                      </motion.div>
                    </div>

                    {/* Timeline Card */}
                    <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:ml-auto"}`}>
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/[0.08]"
                      >
                        <span className="text-primary font-bold text-lg mb-2 block">{step.week}</span>
                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{step.description}</p>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
