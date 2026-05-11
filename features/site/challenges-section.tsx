"use client";
import { motion } from "framer-motion";
import { XCircle, HelpCircle, Layout, TrendingUp, BarChart, Settings, Info } from "lucide-react";

const ChallengesSection = () => {
  const challenges = [
    {
      title: "No Step-by-Step Guidance",
      description: "Many educators are interested but don’t know where to begin.",
      icon: HelpCircle,
    },
    {
      title: "Lack of Structured Curriculum",
      description: "Most available content is scattered and difficult to teach systematically.",
      icon: Layout,
    },
    {
      title: "High Setup Investment",
      description: "Traditional Robotics labs often require ₹5–8 lakh investment and ongoing expenses.",
      icon: TrendingUp,
    },
    {
      title: "Marketing & Student Acquisition",
      description: "Reaching parents and explaining future skills effectively is a major challenge.",
      icon: BarChart,
    },
    {
      title: "No Management System",
      description: "Handling student onboarding, records, payments, and certificates becomes difficult.",
      icon: Settings,
    },
    {
      title: "Technical Resource Confusion",
      description: "Choosing the right components, tools, and equipment can be complicated.",
      icon: Info,
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
          <h2 className="font-display text-4xl md:text-6xl font-bold text-center text-white mb-8 leading-tight">
            Why Many Educators <br />
            <span className="text-destructive">Hesitate to Start</span>
          </h2>
          
          <p className="text-center text-slate-400 text-lg md:text-xl mb-20 max-w-2xl mx-auto leading-relaxed">
            Starting a robotics center shouldn't feel like rocket science. 
            We've identified the barriers that hold back great educators.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
