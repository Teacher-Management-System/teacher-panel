"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Cpu, ArrowRight, Hammer } from "lucide-react";

export default function LearnByBuildingSection() {
  const projects = [
    {
      title: "Obstacle Avoiding Robot Car",
      category: "Robotics & Automation",
      description: "An intelligent autonomous vehicle that measures obstacles using an ultrasonic sensor and dynamically calculates path adjustments.",
      image: "/arduino-robot-project.png",
      specs: ["Arduino Uno", "Ultrasonic Sensor", "DC Gear Motors", "L298D Motor Driver"],
    },
    {
      title: "Smart Home Automation System",
      category: "IoT & Smart Systems",
      description: "A localized model representing smart door locks, automated temperature readouts on LCD screens, and light-sensitive controls.",
      image: "/smart-home-project.png",
      specs: ["Microcontroller", "Servo Motor", "DHT11 Temp Sensor", "16x2 LCD Display"],
    },
  ];

  return (
    <section id="projects" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 mb-4">
              <Hammer className="w-4 h-4 text-primary" /> Practical Learning
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Build Real Projects <br />
              <span className="text-gradient">During Training</span>
            </h2>
            <p className="text-slate-300 text-lg">
              Instead of simply watching videos, you'll build every project yourself using the provided kit. By the end of the program, you'll gain confidence through practical implementation rather than theoretical learning.
            </p>
          </div>

          {/* Project Gallery */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden hover:border-primary/40 transition-all duration-500"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-primary border border-white/10">
                    {proj.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech Specs */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">Components Used:</span>
                    <div className="flex flex-wrap gap-2">
                      {proj.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
                        >
                          <Cpu className="w-3.5 h-3.5 text-primary" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Detail Row */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm font-semibold text-primary">
                    <span>Hands-on Kit Project</span>
                    <div className="flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                      View details <ArrowRight className="w-4 h-4" />
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
