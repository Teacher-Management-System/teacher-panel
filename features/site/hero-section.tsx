"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot,
  GraduationCap,
  Star,
  Download,
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
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    "🎓 Practical Training",
    "🛠 Hands-on Projects",
    "💻 Live Sessions+",
    "📚 Ready Curriculum",
    "📜 Certification",
    "♾️ Lifetime Learning Access",
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-0 overflow-hidden">
      {/* Layered Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute -top-20 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full"
          style={{
            left: `${12 + i * 15}%`,
            top: `${18 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-18, 18, -18],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 backdrop-blur-sm"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> New Batch
              </span>
              <span className="text-sm font-semibold">
                India's Practical Teacher Training Program
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold text-foreground mb-6 leading-[1.15] tracking-tight"
            >
              The Future of Education Needs{" "}
              <span className="relative inline-block">
                <span className="text-gradient">Future-Ready Educators</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C60 3 150 2 298 7"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Become a{" "}
              <strong className="text-foreground font-semibold">
                Certified Robotics & AI Educator
              </strong>
              . Master in Robotics, Artificial Intelligence, Electronics, and
              Project-Based Learning through a structured training program
              designed specifically for educators.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="default"
                  size="lg"
                  asChild
                  className="h-14 rounded-2xl shadow-xl shadow-primary/30 px-8 text-base font-bold"
                >
                  <Link href="/inquiry">
                    Enroll Now
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-flex"
                    >
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-14 rounded-2xl border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 px-8 text-base font-semibold"
                >
                  <Link href="/inquiry">
                    <Download className="w-5 h-5 mr-2 text-primary" />
                    Download Brochure
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              {[
                "Practical Skill Development",
                "6-Week Hybrid Mode",
                "Interactive Live Mentoring",
              ].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" /> {text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Generated Illustration */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-8 bg-gradient-to-r from-primary/25 to-primary/10 rounded-full blur-3xl" />

              {/* Main Illustration */}
              <Image
                src="/hero-educator.svg"
                alt="Robotics & AI Educator Illustration"
                width={680}
                height={560}
                priority
                className="relative w-full h-auto drop-shadow-xl"
              />

              {/* Floating Card: Trained Educators */}
              <motion.div
                className="absolute -left-6 top-[16%] bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary/15"
                animate={{ y: [-6, 6, -6], rotate: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-success/15 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Trained Educators
                    </p>
                    <p className="text-lg font-bold text-foreground">500+</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card: Rating */}
              <motion.div
                className="absolute -right-2 top-[55%] bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary/15"
                animate={{ y: [6, -6, 6], rotate: [1.5, -1.5, 1.5] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Course Rating</p>
                    <p className="text-lg font-bold text-foreground">4.9/5</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card: Hybrid Program */}
              <motion.div
                className="absolute left-[8%] bottom-[4%] bg-card/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-primary/15"
                animate={{ y: [4, -4, 4] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-5 h-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">
                    6-Week Hybrid Program
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Marquee Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-16 border-y border-primary/10 bg-primary/[0.04] backdrop-blur-sm py-4 overflow-hidden"
      >
        <div className="flex w-max animate-marquee gap-4">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap px-4 text-sm font-semibold text-muted-foreground"
            >
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
