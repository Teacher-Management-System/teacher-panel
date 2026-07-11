"use client";
import { motion } from "framer-motion";
import { Compass, Laptop, Cpu, ClipboardCheck, Infinity, Award, ArrowUpRight } from "lucide-react";

export default function DifferentSection() {
  const cards = [
    {
      title: "Structured Learning Journey",
      description: "Learn through carefully designed modules from fundamentals to advanced classroom delivery.",
      icon: Compass,
      color: "border-teal-500/20 text-teal-500 bg-teal-500/5",
    },
    {
      title: "Hybrid Learning",
      description: "Study at your own pace through recorded lectures while interacting with mentors during live doubt sessions.",
      icon: Laptop,
      color: "border-blue-500/20 text-blue-500 bg-blue-500/5",
    },
    {
      title: "Practical Project Building",
      description: "Every concept is learned by building real working projects using the provided hardware kit.",
      icon: Cpu,
      color: "border-purple-500/20 text-purple-500 bg-purple-500/5",
    },
    {
      title: "Classroom Ready Curriculum",
      description: "Receive structured lesson plans, projects, worksheets, and teaching guidance.",
      icon: ClipboardCheck,
      color: "border-pink-500/20 text-pink-500 bg-pink-500/5",
    },
    {
      title: "Lifetime Access",
      description: "Continue revising and learning anytime through lifetime access to recorded content.",
      icon: Infinity,
      color: "border-amber-500/20 text-amber-500 bg-amber-500/5",
    },
    {
      title: "Industry Recognized Certification",
      description: "Earn your Aerophantom Educator Certification after successfully completing the program.",
      icon: Award,
      color: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5",
    },
  ];

  return (
    <section id="different" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -ml-64 -mb-64" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 mb-4">
              Our Methodology
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What Makes This <br />
              <span className="text-gradient">Program Different?</span>
            </h2>
            <p className="text-slate-600 text-lg">
              We go beyond simple lectures by providing a complete ecosystem for hands-on, high-confidence teaching outcomes.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-200/80 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] overflow-hidden"
              >
                {/* Glowing Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${card.color}`}>
                  <card.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                  {card.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed text-base mb-6">
                  {card.description}
                </p>

                {/* Arrow up-right detail */}
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all ml-auto">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
