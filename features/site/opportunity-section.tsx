"use client";
import { motion } from "framer-motion";
import { Rocket, Target, Users, BookOpen, Lightbulb, CheckCircle2 } from "lucide-react";

const OpportunitySection = () => {
  const highlights = [
    { text: "Growing Student Demand", icon: Users },
    { text: "Limited Quality Training Centers", icon: Target },
    { text: "Future-Focused Skill Requirement", icon: BookOpen },
    { text: "High Parent Interest", icon: Lightbulb },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="opportunity" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -mr-64 -mb-64" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Tag */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-primary font-bold text-xs uppercase tracking-widest border border-primary/10 shadow-sm">
              <Rocket className="w-4 h-4 text-primary" />
              The Education is Changing
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16 leading-tight">
            Education is Changing. <br />
            <span className="text-gradient">Are We Preparing Students for the Future?</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6 text-xl text-slate-600 leading-relaxed">
                <p className="font-medium text-slate-900">
                  Technology is no longer limited to engineering colleges or large industries.
                </p>
                <p>
                  Artificial Intelligence, Robotics, Automation, and Smart Technologies are becoming a part of every industry and every career.
                </p>
                <p className="text-base text-slate-500">
                  Schools are introducing future skills into classrooms, but one challenge still remains—
                  <strong> there are not enough trained educators who can confidently teach these technologies.</strong>
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Emerging AI & Robotics modules in school curricula",
                  "High demand for teachers with tech competency",
                  "Need for hands-on, project-based teaching skills",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                      <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[
                { text: "AI & ML Everywhere", icon: Users },
                { text: "Robotics in Classrooms", icon: Target },
                { text: "Hands-on Future Skills", icon: BookOpen },
                { text: "Confidence to Teach", icon: Lightbulb },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative p-8 rounded-[2rem] bg-white border border-slate-200/60 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg leading-snug">{item.text}</h4>
                  
                  {/* Subtle Accent */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-150 transition-all" />
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
