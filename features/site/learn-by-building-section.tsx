"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Cpu, ArrowRight, Hammer, Wrench } from "lucide-react";

export default function LearnByBuildingSection() {
  const projects = [
    {
      title: "Obstacle Avoiding Robot Car",
      category: "Robotics & Automation",
      description:
        "An intelligent autonomous vehicle that measures obstacles using an ultrasonic sensor and dynamically calculates path adjustments.",
      image: "/arduino-robot-project.png",
      specs: [
        "Arduino Uno",
        "Ultrasonic Sensor",
        "DC Gear Motors",
        "L298D Motor Driver",
      ],
    },
    {
      title: "Smart Home Automation System",
      category: "IoT & Smart Systems",
      description:
        "A localized model representing smart door locks, automated temperature readouts on LCD screens, and light-sensitive controls.",
      image: "/smart-home-project.png",
      specs: [
        "Microcontroller",
        "Servo Motor",
        "DHT11 Temp Sensor",
        "16x2 LCD Display",
      ],
    },
  ];

  return (
    <section
      id="projects"
      className="py-28 bg-slate-900 text-white relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 mb-5">
              <Hammer className="w-4 h-4 text-primary" /> Practical Learning
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
              Build Real Projects{" "}
              <span className="text-gradient">During Training</span>
            </h2>
            <p className="text-slate-300 text-lg">
              Instead of simply watching videos, you'll build every project
              yourself using the provided kit — gaining confidence through
              practical implementation, not just theory.
            </p>
          </div>

          {/* Project Gallery */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-[2rem] bg-white/[0.04] border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_30px_70px_-25px_rgba(31,192,199,0.4)] hover:-translate-y-1.5"
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

                  <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-primary border border-primary/25">
                    {proj.category}
                  </span>

                  <span className="absolute bottom-4 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/30">
                    <Wrench className="w-3.5 h-3.5" /> You build this
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 md:p-8 space-y-5">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech Specs */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">
                      Components Used:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {proj.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 hover:border-primary/40 transition-colors"
                        >
                          <Cpu className="w-3.5 h-3.5 text-primary" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Row */}
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
