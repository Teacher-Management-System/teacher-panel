"use client";
import { motion } from "framer-motion";
import { CheckCircle, School, Milestone, Trophy, UserCheck, Flame, Compass } from "lucide-react";

export default function PostProgramSection() {
  const pathways = [
    {
      title: "Conduct Robotics & AI classes in schools",
      description: "Directly manage and lead advanced robotics classes and labs in primary and secondary schools.",
      icon: School,
    },
    {
      title: "Teach project-based STEM education",
      description: "Deliver active learning STEM classes using standard curriculum formats, assessments, and projects.",
      icon: Milestone,
    },
    {
      title: "Improve your professional teaching profile",
      description: "Distinguish your profile and gain professional advantage with an in-demand, niche skill set.",
      icon: Trophy,
    },
    {
      title: "Deliver practical technology workshops",
      description: "Conduct independent weekend bootcamps, workshops, and science camps for school kids.",
      icon: UserCheck,
    },
    {
      title: "Mentor students through innovation projects",
      description: "Inspire kids to build project submissions for science fairs, hackathons, and national competitions.",
      icon: Flame,
    },
    {
      title: "Part of Aerophantom's educator ecosystem",
      description: "Get placement opportunities, training materials, client leads, and complete technical backend support.",
      icon: Compass,
    },
  ];

  return (
    <section id="post-program" className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest border border-slate-100 mb-4 shadow-sm">
              Future Pathways
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Where Can This <br />
              <span className="text-gradient">Certification Take You?</span>
            </h2>
            <p className="text-slate-600 text-lg">
              After completing the program, you'll be prepared to transition into high-growth educational roles and build a unique teaching brand.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pathways.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white transition-all duration-300 hover:shadow-xl"
              >
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors ml-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
