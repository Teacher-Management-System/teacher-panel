"use client";
import { motion } from "framer-motion";

export default function LearningJourneySection() {
  const steps = [
    {
      label: "Module 01",
      emoji: "🤖",
      title: "Fundamentals of Robotics",
      description:
        "Build a strong foundation by understanding electronics, components, sensors, actuators, and the core concepts behind robotics systems.",
      color: "bg-amber-500/15 text-amber-400 border-amber-400/30",
    },
    {
      label: "Module 02",
      emoji: "⚙️",
      title: "No-Code Robotics",
      description:
        "Learn to design and control robotics projects using visual programming and beginner-friendly platforms—perfect for introducing robotics to students.",
      color: "bg-blue-500/15 text-blue-400 border-blue-400/30",
    },
    {
      label: "Module 03",
      emoji: "🔄",
      title: "Automation",
      description:
        "Understand how sensors, controllers, and electronic devices work together to create smart automation systems through practical projects.",
      color: "bg-purple-500/15 text-purple-400 border-purple-400/30",
    },
    {
      label: "Module 04",
      emoji: "💻",
      title: "Coding",
      description:
        "Learn programming fundamentals, logic building, and Arduino programming to create interactive robotics and automation solutions.",
      color: "bg-pink-500/15 text-pink-400 border-pink-400/30",
    },
    {
      label: "Module 05",
      emoji: "🚀",
      title: "Coding in Action",
      description:
        "Apply your coding skills by building real-world robotics and IoT projects, helping you gain confidence in practical implementation.",
      color: "bg-teal-500/15 text-teal-400 border-teal-400/30",
    },
    {
      label: "Module 06",
      emoji: "🧠",
      title: "Artificial Intelligence (Beginner to Advanced)",
      description:
        "Explore AI concepts from the basics to practical applications, including computer vision and AI-powered projects that can be introduced in classrooms.",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
    },
  ];

  return (
    <section
      id="journey"
      className="py-14 bg-slate-950 text-white relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 -ml-48" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -mr-48" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 mb-5">
              Learning Journey
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
              Your Learning <br />
              <span className="text-gradient">Journey & Modules</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Throughout this comprehensive training program, you'll develop both technical knowledge and practical teaching skills through carefully designed learning modules.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[29px] md:left-1/2 top-2 bottom-2 w-[3px] bg-gradient-to-b from-primary via-primary/40 to-primary/10 rounded-full md:-translate-x-[1.5px]" />

            <div className="space-y-12">
              {steps.map((step, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    className="relative flex flex-col md:flex-row items-start md:items-center"
                  >
                    {/* Node */}
                    <div className="absolute left-[30px] md:left-1/2 -translate-x-1/2 z-20">
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className={`w-[58px] h-[58px] rounded-2xl border backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/40 ${step.color}`}
                      >
                        <span className="text-2xl">{step.emoji}</span>
                      </motion.div>
                    </div>

                    {/* Card */}
                    <div
                      className={`w-full md:w-1/2 pl-20 md:pl-0 ${
                        isEven
                          ? "md:pr-14 md:text-right"
                          : "md:pl-14 md:ml-auto"
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                        className="group relative p-7 md:p-8 rounded-[2rem] bg-white/[0.04] border border-white/10 hover:border-primary/40 transition-all duration-500 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_-20px_rgba(31,192,199,0.35)]"
                      >
                        <span
                          className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary font-bold text-xs uppercase tracking-widest`}
                        >
                          {step.label}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finish flag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 mt-14 flex justify-center"
            >
              <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30">
                🎉 Certified Robotics & AI Educator
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
