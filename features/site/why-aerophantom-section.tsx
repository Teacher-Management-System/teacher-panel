"use client";
import { motion } from "framer-motion";
import { Sparkles, CheckSquare, Zap, BookOpen, HardDrive, HelpingHand } from "lucide-react";

export default function WhyAerophantomSection() {
  const pillars = [
    {
      title: "Practical Learning",
      description: "Build real circuits and write firmware instead of just studying theory.",
      icon: Zap,
    },
    {
      title: "Structured Curriculum",
      description: "Get age-appropriate worksheets, plans, and progression templates.",
      icon: BookOpen,
    },
    {
      title: "Technology Kits",
      description: "Hands-on access to robust physical microcontrollers, boards, and sensors.",
      icon: HardDrive,
    },
    {
      title: "Continuous Support",
      description: "Continuous guidance for classroom execution and curriculum updates.",
      icon: HelpingHand,
    },
  ];

  return (
    <section id="why-aerophantom" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Soft floating decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -ml-40" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -mr-40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left Side Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-bold text-xs uppercase tracking-widest border border-primary/10 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary" /> More Than a Training Platform
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Why <br />
                <span className="text-gradient">Aerophantom?</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Aerophantom is building an ecosystem where students gain future-ready skills and educators receive everything they need to confidently teach them.
              </p>
              <p className="text-slate-500 text-base leading-relaxed">
                Through practical learning, structured curriculum, technology kits, and continuous support, we are making Robotics & AI education accessible across schools and communities.
              </p>

              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <p className="text-slate-700 italic font-semibold">
                  "Our mission is to enable passionate teachers to confidently guide students into the tech-driven future."
                </p>
              </div>
            </motion.div>

            {/* Right Side Cards Grid */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {pillars.map((pil, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-8 rounded-[2.5rem] bg-white border border-slate-200/60 hover:border-primary/30 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <pil.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {pil.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {pil.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <CheckSquare className="w-4 h-4 text-success" /> Integrated Support
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
