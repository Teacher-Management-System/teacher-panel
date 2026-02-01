"use client";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    teachers: 0,
    students: 0,
    satisfaction: 0,
  });
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

  // Animated counter effect
  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setCounters({
          teachers: Math.floor(500 * easeOut),
          students: Math.floor(10000 * easeOut),
          satisfaction: Math.floor(99 * easeOut),
        });

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const stats = [
    {
      icon: TrendingUp,
      value: `${counters.teachers}+`,
      label: "Active Teachers",
      color: "text-primary",
    },
    {
      icon: Award,
      value: `${counters.students > 999 ? Math.floor(counters.students / 1000) + "K" : counters.students}+`,
      label: "Students Managed",
      color: "text-primary",
    },
    {
      icon: Heart,
      value: `${counters.satisfaction}%`,
      label: "Satisfaction Rate",
      color: "text-primary",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              About Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Empowering Robotics <br />
              <span className="text-gradient">Education Since 2020</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Aerophantom is a practical STEM education company helping teachers
              deliver real robotics skills through hands-on training, projects,
              and industry-relevant learning.
            </p>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              We focus on training, not just kits — so students learn how to
              think, design, and solve problems.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group text-center p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div
                    className={`font-display text-3xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Contact Card */}
          <div
            className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse-slow" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" />

              <div className="relative bg-card rounded-3xl p-8 border border-border shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-18 h-18 rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-pulse-slow p-4">
                    <Building2 className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      Aerophantom
                    </h3>
                    <p className="text-muted-foreground">
                      Your Partner in Robotics Education
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: "Address",
                      content: [
                        "Plot no 57 Balaji Vihar 2 Govindpura Kalwar Road,",
                        "Jaipur, Rajasthan 302012",
                      ],
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      content: ["Info@aerophantom.com"],
                    },
                    {
                      icon: Phone,
                      title: "Phone",
                      content: ["+91 9509206534"],
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-all duration-300 group cursor-pointer ${
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-5"
                      }`}
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        {item.content.map((line, i) => (
                          <p key={i} className="text-muted-foreground">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-sm text-center text-muted-foreground">
                    Have questions? Our support team is available 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
