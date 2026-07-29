"use client";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Layout,
  TrendingUp,
  BarChart,
  Settings,
  Info,
  ArrowRight,
} from "lucide-react";

const ChallengesSection = () => {
  const challenges = [
    {
      title: "Unsure Where to Begin",
      description:
        "Robotics & AI can seem overwhelming, leaving educators confused about the starting point.",
      icon: HelpCircle,
    },
    {
      title: "No Structured Curriculum",
      description:
        "Lack of a progressive teaching roadmap or standard curriculum customized for school students.",
      icon: Layout,
    },
    {
      title: "Limited Practical Exposure",
      description:
        "Learning mostly through videos with very little experience building real working hardware projects.",
      icon: TrendingUp,
    },
    {
      title: "Classroom Delivery Difficulty",
      description:
        "Struggling to manage components, troubleshooting code, and conducting hands-on group sessions.",
      icon: BarChart,
    },
    {
      title: "Lack of Confidence",
      description:
        "Feeling unprepared or hesitant when answering advanced student questions on emerging technologies.",
      icon: Settings,
    },
  ];

  return (
    <section
      id="challenges"
      className="py-14 relative overflow-hidden bg-slate-950"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(31,192,199,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-14">
            {/* Sticky Left Header */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32 space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-red-400 font-bold text-xs uppercase tracking-widest border border-white/10 backdrop-blur-md">
                  <Info className="w-3.5 h-3.5" /> The Reality
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                  Bridging the Gap Between{" "}
                  <span className="text-red-400">Technology</span> &{" "}
                  <span className="text-gradient">Teaching</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Most teachers are passionate about helping students succeed,
                  but Robotics and AI are relatively new domains. As a result,
                  many educators face common challenges:
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-3xl bg-primary/10 border border-primary/25 backdrop-blur-sm"
                >
                  <p className="text-primary font-semibold text-lg flex items-end justify-between gap-3">
                    <span>
                      Aerophantom solves these challenges with one complete
                      educator ecosystem.
                    </span>
                    <ArrowRight className="w-5 h-5 mb-1 shrink-0 animate-pulse" />
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right Numbered List */}
            <div className="lg:col-span-7 space-y-5">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative flex gap-5 md:gap-7 p-6 md:p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-red-400/40 hover:bg-white/[0.07] transition-all duration-500 backdrop-blur-sm"
                >
                  {/* Big Number */}
                  <span className="font-display text-5xl md:text-6xl font-bold text-white/10 group-hover:text-red-400/30 transition-colors leading-none select-none">
                    0{index + 1}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-xl bg-red-400/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <challenge.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                        {challenge.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {challenge.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
