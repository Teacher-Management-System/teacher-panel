"use client";
import { motion } from "framer-motion";
import { School, Presentation, GraduationCap, Building2, ChevronRight } from "lucide-react";

export default function WhoIsForSection() {
  const audiences = [
    {
      title: "School Teachers",
      description: "Upgrade your teaching skills and confidently conduct Robotics & AI classes in your school.",
      icon: School,
      tag: "🏫 School",
      color: "from-teal-500/10 to-teal-500/5 hover:border-teal-500/30 text-teal-600 dark:text-teal-400",
      iconColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      title: "Existing Robotics Trainers",
      description: "Strengthen your technical concepts, improve classroom delivery, and access a structured curriculum.",
      icon: Presentation,
      tag: "👨‍🏫 Trainer",
      color: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/30 text-blue-600 dark:text-blue-400",
      iconColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Aspiring Educators",
      description: "Build a strong foundation and start your career in Robotics & AI education.",
      icon: GraduationCap,
      tag: "🎓 Aspiring",
      color: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/30 text-purple-600 dark:text-purple-400",
      iconColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Coaching Institutes & STEM Trainers",
      description: "Expand your offerings with future-ready technology programs.",
      icon: Building2,
      tag: "🏢 Institutes",
      color: "from-amber-500/10 to-amber-500/5 hover:border-amber-500/30 text-amber-600 dark:text-amber-400",
      iconColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <section id="who-is-for" className="py-24 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 mb-4">
              Target Audience
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Designed for Every <br />
              <span className="text-gradient">Educator Ready to Grow</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              No matter your starting point or background, our hybrid ecosystem is built to scale your knowledge and teaching confidence.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {audiences.map((aud, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br border border-border/50 hover:shadow-xl transition-all duration-500 ${aud.color}`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${aud.iconColor}`}>
                    <aud.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-card text-xs font-semibold text-muted-foreground border border-border shadow-sm">
                      {aud.tag}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {aud.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {aud.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn more <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
