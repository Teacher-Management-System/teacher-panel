"use client";

import {
  UserPlus,
  GraduationCap,
  Users,
  Rocket,
  CheckCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Register",
    description: "Apply to become a Robotics Partner.",
  },
  {
    icon: GraduationCap,
    number: "02",
    title: "Get Trained",
    description: "Complete technical + teaching certification.",
  },
  {
    icon: Users,
    number: "03",
    title: "Onboard Students",
    description:
      "Add students using your unique ID. They appear directly in your dashboard.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Start Teaching & Earning",
    description:
      "Receive kits, content, marketing tools, and begin your robotics classes.",
  },
];

const HowItWorksSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance steps animation
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,hsl(var(--primary)/0.03)_49%,hsl(var(--primary)/0.03)_51%,transparent_52%)] bg-[size:30px_30px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Get Started in
            <span className="text-gradient"> 4 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From signup to panel access - we've made the process simple and
            secure.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-28 left-[10%] right-[10%] h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;

              return (
                <div
                  key={index}
                  className={`relative transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`flex flex-col items-center text-center cursor-pointer group p-4 rounded-3xl transition-all duration-300`}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Step Number & Icon */}
                    <div className="relative mb-6">
                      <div
                        className={`relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg z-10 transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-primary/25 scale-105"
                            : "bg-white border-2 border-border text-muted-foreground group-hover:border-primary/50"
                        }`}
                      >
                        <step.icon className="w-10 h-10" />

                        {/* Step Number Badge - Integrated look */}
                        <div
                          className={`absolute -top-3 -right-3 w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center shadow-sm transition-all duration-300 ${
                            isActive
                              ? "bg-primary text-primary-foreground border-4 border-background"
                              : "bg-white text-muted-foreground border-2 border-border"
                          }`}
                        >
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3
                      className={`font-display text-lg font-bold mb-2 transition-colors duration-300 ${isActive ? "text-primary" : "text-foreground"}`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-[200px]">
                      {step.description}
                    </p>

                    {/* Check Mark for Completed */}
                    {index < activeStep && (
                      <div className="mt-4 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center animate-bounce-in">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Dots - Mobile */}
          <div className="flex justify-center gap-2 mt-10 lg:hidden">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeStep
                    ? "bg-primary w-8"
                    : "bg-border hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
