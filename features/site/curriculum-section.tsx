"use client";
import { motion } from "framer-motion";
import { Zap, Bot, RefreshCw, Cpu, Brain, Code2, ArrowRight } from "lucide-react";

const CurriculumSection = () => {
  const modules = [
    {
      title: "Electronics Fundamentals",
      description: "Basic electronics, circuits, components, and practical hardware understanding.",
      icon: Zap,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      title: "No-Code Robotics",
      description: "Learn robotics logic and automation concepts without complex programming barriers.",
      icon: Bot,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      title: "Automation Systems",
      description: "Sensors, actuators, smart systems, and real-world automation applications.",
      icon: RefreshCw,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      title: "Programming Logic",
      description: "Coding fundamentals, logical thinking, and problem-solving approaches.",
      icon: Code2,
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    },
    {
      title: "AI Integration",
      description: "Understanding Artificial Intelligence concepts and smart technology systems.",
      icon: Brain,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
  ];

  return (
    <section id="curriculum" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -ml-48" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 -mr-48" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Tag */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20">
              <Zap className="w-3 h-3" /> Curriculum
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-center text-foreground mb-6 leading-tight">
            Future-Ready <br />
            <span className="text-gradient">Learning Modules</span>
          </h2>

          <p className="text-center text-muted-foreground text-lg md:text-xl mb-16 max-w-3xl mx-auto leading-relaxed">
            Our curriculum is built on a foundation of practical experimentation, 
            designed to help students move from theory to real-world innovation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                {/* Hover Background Accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${module.color}`}>
                  <module.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {module.description}
                </p>

                {/* Decorative Element */}
                <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Explore Module <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
