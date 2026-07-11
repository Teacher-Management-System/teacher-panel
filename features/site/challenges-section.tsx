"use client";
import { motion } from "framer-motion";
import { XCircle, HelpCircle, Layout, TrendingUp, BarChart, Settings, Info } from "lucide-react";

const ChallengesSection = () => {
  const challenges = [
    {
      title: "Unsure Where to Begin",
      description: "Robotics & AI can seem overwhelming, leaving educators confused about the starting point.",
      icon: HelpCircle,
    },
    {
      title: "No Structured Curriculum",
      description: "Lack of a progressive teaching roadmap or standard curriculum customized for school students.",
      icon: Layout,
    },
    {
      title: "Limited Practical Exposure",
      description: "Learning mostly through videos with very little experience building real working hardware projects.",
      icon: TrendingUp,
    },
    {
      title: "Classroom Delivery Difficulty",
      description: "Struggling to manage components, troubleshooting code, and conducting hands-on group sessions.",
      icon: BarChart,
    },
    {
      title: "Lack of Confidence",
      description: "Feeling unprepared or hesitant when answering advanced student questions on emerging technologies.",
      icon: Settings,
    },
  ];

  return (
    <section id="challenges" className="py-32 relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(239,68,68,0.05),transparent)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Tag */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-destructive font-bold text-xs uppercase tracking-widest border border-white/10 backdrop-blur-md">
              <Info className="w-3 h-3" /> The Reality
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center text-white mb-8 leading-tight">
            Bridging the Gap Between <br />
            <span className="text-destructive">Technology & Teaching</span>
          </h2>
          
          <p className="text-center text-slate-400 text-lg md:text-xl mb-20 max-w-2xl mx-auto leading-relaxed">
            Most teachers are passionate about helping students succeed, but Robotics and AI are relatively new domains. As a result, many educators face common challenges:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-destructive/50 transition-all duration-500 hover:bg-white/10 backdrop-blur-sm"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive font-bold backdrop-blur-xl group-hover:scale-110 transition-transform">
                  0{index + 1}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-destructive/10">
                  <challenge.icon className="w-7 h-7 text-destructive" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-destructive transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {challenge.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-6 rounded-3xl bg-primary/10 border border-primary/20 max-w-2xl mx-auto"
          >
            <p className="text-primary font-semibold text-lg">
              Aerophantom solves these challenges with one complete educator ecosystem.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
