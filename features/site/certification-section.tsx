"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Award, FileCheck2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CertificationSection() {
  const points = [
    { title: "Skill Validation", desc: "Verifies your practical hardware assembly, circuit wiring, and coding logic proficiency." },
    { title: "Teaching Readiness", desc: "Confirms training in STEM teaching methods, student management, and trouble-shooting." },
    { title: "Professional Advantage", desc: "A prestigious, shareable credential to leverage on LinkedIn, resume, and school pitches." },
  ];

  return (
    <section id="certification" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background soft blurs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 shadow-sm">
                  <Award className="w-4 h-4 text-primary" /> Verified Credential
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  Become a Certified <br />
                  <span className="text-gradient">Robotics & AI Educator</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Receive an official certification from Aerophantom that validates your practical hardware skills and classroom teaching readiness.
                </p>
              </div>

              {/* Validation Points */}
              <div className="space-y-6">
                {points.map((pt, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/[0.08] transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{pt.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button variant="default" size="lg" asChild className="shadow-lg shadow-primary/25 px-8">
                  <Link href="/inquiry">
                    Get Certified Now <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Certificate Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
              className="relative flex items-center justify-center"
            >
              {/* Outer Frame with Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur-2xl opacity-60" />
              
              <div className="relative aspect-square w-full max-w-[500px] rounded-3xl bg-slate-900 border-4 border-slate-800 shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-500 hover:shadow-primary/20">
                <Image
                  src="/educator-certificate.png"
                  alt="Aerophantom Certified Educator Certificate Mockup"
                  fill
                  priority
                  className="object-contain p-2 bg-slate-900"
                />
              </div>

              {/* Small floating badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/25 flex items-center justify-center text-primary">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Profile</p>
                  <p className="text-xs font-bold text-white">ISO 9001:2015 Cert</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
