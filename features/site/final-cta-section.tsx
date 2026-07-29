"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Rocket, PhoneCall, CheckCircle2 } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-12 md:py-14 relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] mx-3 md:mx-8 my-8">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-teal-700" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-950/25 rounded-full blur-[100px]"
      />

      {/* Robot mascot peeking */}
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-6 lg:right-16 bottom-0 w-40 lg:w-56 opacity-90 hidden md:block"
      >
        <Image
          src="/robot-mascot.svg"
          alt="Aerophantom Robot Mascot"
          width={224}
          height={236}
          className="w-full h-auto drop-shadow-2xl"
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] border border-white/20 backdrop-blur-md">
              Start Your Journey
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1]"
          >
            Your Students Are Preparing for the Future. <br />
            <span className="text-white/90">Are You Ready to Teach It?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join hundreds of educators who are upgrading their skills with
            Aerophantom and becoming part of the future of technology
            education.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-5 text-left max-w-3xl mx-auto mb-14">
            {[
              "Upgrade to in-demand 21st-century tech skills",
              "Get a complete physical hardware kit shipped",
              "Access student worksheets & ready lesson plans",
              "Earn a verified shareable teacher certification",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl group hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white transition-all">
                  <CheckCircle2 className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                </div>
                <span className="text-white font-semibold">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-primary font-bold h-16 px-10 rounded-2xl text-lg shadow-2xl hover:scale-105 hover:shadow-white/30 transition-all bg-white hover:bg-white"
            >
              <Link href="/inquiry">
                Inquire Now <Rocket className="ml-2 w-5 h-5" />
              </Link>
            </Button>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
