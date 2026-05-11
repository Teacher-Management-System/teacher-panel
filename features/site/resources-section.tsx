"use client";
import { motion } from "framer-motion";
import {
  Thermometer,
  Settings,
  Zap,
  Cpu,
  Car,
  Wrench,
  CheckCircle2
} from "lucide-react";

const ResourcesSection = () => {
  const categories = [
    {
      title: "Sensors",
      items: ["Temperature Sensor", "Light Sensor", "Soil Moisture", "Ultrasonic Sensor", "IR Modules"],
      icon: Thermometer,
    },
    {
      title: "Actuators",
      items: ["Servo Motors", "LCD Displays", "Exhaust Fans", "Relays", "Buzzers"],
      icon: Settings,
    },
    {
      title: "Electronics Components",
      items: ["LEDs", "Resistors", "Jumper Wires", "Breadboards", "Switches"],
      icon: Zap,
    },
    {
      title: "Controllers & Power",
      items: ["Arduino Boards", "Power Supply Modules", "Drivers", "Control Systems"],
      icon: Cpu,
    },
    {
      title: "Robo Car Components",
      items: ["BO Motors", "Wheels", "Chassis", "Motor Drivers"],
      icon: Car,
    },
    {
      title: "Tools & Equipment",
      items: ["Multimeter", "Soldering Iron", "Webcam Modules", "Testing Tools"],
      icon: Wrench,
    },
  ];

  return (
    <section id="resources" className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Technical Background Elements */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Tag */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-primary font-bold text-xs uppercase tracking-widest border border-white/10 backdrop-blur-md">
              <Wrench className="w-3 h-3" /> Hardware Ecosystem
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-center text-white mb-8 leading-tight">
            Real Components. <br />
            <span className="text-primary">Actual Engineering.</span>
          </h2>

          <p className="text-center text-slate-400 text-lg md:text-xl mb-20 max-w-3xl mx-auto leading-relaxed">
            We don't use toys. We provide the same components used by professional engineers 
            to build real-world automation and robotics systems.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 hover:bg-white/[0.08] backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/5">
                  <category.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-6">
                  {category.title}
                </h3>
                
                <ul className="space-y-4">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative Tech Detail */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Cpu className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
