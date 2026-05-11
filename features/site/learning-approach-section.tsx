"use client";
import { motion } from "framer-motion";
import { 
  Lightbulb, 
  BrainCircuit, 
  Rocket, 
  CheckCircle2,
  Cpu
} from "lucide-react";

const LearningApproachSection = () => {
  const points = [
    "How components work",
    "Why systems behave in certain ways",
    "How automation logic is created",
    "How technology can solve real-world problems",
  ];

  const benefits = [
    { text: "Concept Clarity", icon: Lightbulb },
    { text: "Logical Thinking", icon: BrainCircuit },
    { text: "Innovation Mindset", icon: Rocket },
    { text: "Real Problem Solving", icon: Cpu },
  ];

  return (
    <section id="learning-approach" className="py-32 relative overflow-hidden bg-white">
      {/* Subtle Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Tag */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm">
              <BrainCircuit className="w-4 h-4" />
              Philosophy
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-center text-slate-900 mb-16 leading-tight">
            Beyond Projects — <br />
            <span className="text-gradient">Building Real Understanding</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <p className="text-xl text-slate-600 leading-relaxed relative z-10">
                  Our focus is not just to help students complete projects, but to help them 
                  <span className="text-slate-900 font-bold"> master the concepts </span> 
                  behind them. Students learn:
                </p>
              </div>
              
              <div className="grid gap-4">
                {points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-primary/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                      <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                    <span className="text-lg font-semibold text-slate-800">{point}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-slate-500 text-lg leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                This approach helps students confidently create, innovate, 
                and independently scale new ideas.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[3rem] bg-white border border-slate-200/60 flex flex-col items-center text-center group hover:border-primary/40 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
                >
                  <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:scale-110 group-hover:rotate-3">
                    <benefit.icon className="w-10 h-10" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningApproachSection;
