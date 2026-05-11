"use client";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Megaphone, 
  Box, 
  LayoutDashboard, 
  Presentation, 
  Home,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const SolutionSection = () => {
  const solutions = [
    {
      title: "Dedicated Educator Training",
      description: "Structured step-by-step training with recorded sessions, practical guidance, and live doubt support.",
      icon: GraduationCap,
    },
    {
      title: "Structured Curriculum",
      description: "Ready-to-teach modules covering Robotics, AI, Electronics, Automation, and innovation-based learning.",
      icon: BookOpen,
    },
    {
      title: "Marketing Support",
      description: "Pamphlets, banners, digital creatives, awareness material, and promotional support.",
      icon: Megaphone,
    },
    {
      title: "Practical Resources & Equipment",
      description: "All required components, tools, and electronics used during practical learning sessions.",
      icon: Box,
    },
    {
      title: "Student Management System",
      description: "Student onboarding, tracking, payment, and course management platform.",
      icon: LayoutDashboard,
    },
    {
      title: "Parent Pitch Resources",
      description: "Presentation materials and awareness content to help educators explain the value of Robotics & AI to parents confidently.",
      icon: Presentation,
    },
    {
      title: "No Heavy Infrastructure Required",
      description: "Start from your home, tuition center, school, or existing classroom setup.",
      icon: Home,
    },
  ];

  return (
    <section id="solution" className="py-24 relative overflow-hidden bg-slate-50">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -ml-96 -mb-96" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Tag */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-primary font-bold text-xs uppercase tracking-widest border border-primary/10 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              One-Stop Educator Ecosystem
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-center text-slate-900 mb-8 leading-tight">
            Everything You Need <br />
            <span className="text-gradient">To Launch Successfully</span>
          </h2>

          <p className="text-center text-slate-600 text-lg md:text-xl mb-20 max-w-3xl mx-auto leading-relaxed">
            We provide a complete, plug-and-play system so you can focus on what you do best: 
            inspiring the next generation of innovators.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-200/60 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
              >
                {/* Decorative Icon Container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                    <solution.icon className="w-10 h-10 transition-transform duration-500" />
                  </div>
                  {/* Subtle Glow */}
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  {solution.description}
                </p>

                <div className="flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  Detailed support <CheckCircle2 className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
