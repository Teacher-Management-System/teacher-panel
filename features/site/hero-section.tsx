"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot,
  Cpu,
  Award,
  Zap,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const marqueeItems = [
    { text: "Practical Training", icon: Zap },
    { text: "Hands-on Projects", icon: Cpu },
    { text: "Live Sessions+", icon: Bot },
    { text: "Ready Curriculum", icon: BookOpen },
    { text: "Recognized Certification", icon: Award },
    { text: "Lifetime Learning Access", icon: ShieldCheck },
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center pt-24 pb-8 overflow-hidden bg-background">
      {/* Background Decorative Gradients & Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,black_30%,transparent_100%)]" />

      {/* Dynamic Ambient Light Spheres */}
      <motion.div
        className="absolute top-10 left-[15%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-[10%] w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-[110px] pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.25, 0.5, 0.25],
          y: [-30, 30, -30],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Hero Content */}
          <motion.div
            className="lg:col-span-7 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top Pill Tag */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-foreground">
                  India&apos;s Practical Teacher Training Program
                </span>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-foreground mb-6 leading-[1.12] tracking-tight"
            >
              The Future of Education Needs{" "}
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-primary via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Future-Ready Educators
                </span>
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C60 3 150 2 298 7"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal"
            >
              Become a{" "}
              <span className="text-foreground font-semibold underline decoration-primary/40 underline-offset-4">
                Certified Robotics & AI Educator
              </span>
              . Master Robotics, Artificial Intelligence, Electronics, and
              Project-Based Learning through structured, hands-on mentor guidance.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="default"
                  size="lg"
                  asChild
                  className="h-14 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 px-8 text-base font-bold transition-all duration-300 hover:shadow-primary/50"
                >
                  <Link href="/inquiry" className="flex items-center gap-2">
                    <span>Inquire Now</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>

            </motion.div>

            {/* Feature Checkmarks Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-2 border-t border-border/50 text-sm text-muted-foreground font-medium"
            >
              {[
                "Practical Skill Development",
                "6-Week Hybrid Mode",
                "Interactive Live Mentoring",
              ].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{text}</span>
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Showcase Image & Interactive Glass Cards */}
          <motion.div
            className="lg:col-span-5 relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Outer Layered Glow Frame */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 via-teal-400/25 to-emerald-400/30 rounded-[2.8rem] blur-2xl opacity-75" />

              {/* Main Glassmorphic Photo Container */}
              <div className="relative rounded-[2.4rem] overflow-hidden border-2 border-primary/25 bg-card/40 backdrop-blur-xl p-3 shadow-2xl shadow-primary/20">
                <div className="relative rounded-[1.8rem] overflow-hidden group">
                  <Image
                    src="/hero.png"
                    alt="Robotics & AI Educator Showcase"
                    width={680}
                    height={560}
                    priority
                    className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Shimmer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[1.8rem] pointer-events-none" />
                </div>
              </div>

              {/* Floating Top Badge: AI & Robotics */}
              <motion.div
                className="absolute -top-4 -right-4 bg-card/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-primary/20 flex items-center gap-3"
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Next-Gen Tech
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    Robotics & AI
                  </p>
                </div>
              </motion.div>

              {/* Floating Bottom Badge: 6-Week Program */}
              <motion.div
                className="absolute -left-5 -bottom-4 bg-card/95 backdrop-blur-xl px-5 py-3.5 rounded-2xl shadow-xl border border-primary/20 flex items-center gap-3"
                animate={{ y: [4, -4, 4] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Training Mode
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    6-Week Hybrid Program
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Marquee Ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-8 border-y border-border/60 bg-muted/30 backdrop-blur-md py-3 overflow-hidden"
      >
        <div className="flex w-max animate-marquee gap-6">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 whitespace-nowrap px-5 py-1.5 rounded-full bg-background/50 border border-border/40 text-xs sm:text-sm font-semibold text-foreground/80 shadow-xs"
              >
                <IconComponent className="w-4 h-4 text-primary" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
