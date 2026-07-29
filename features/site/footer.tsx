"use client";

import {
  ArrowUp,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  PhoneCall,
  MapPin,
  ExternalLink,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import NextImage from "next/image";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-10 relative overflow-hidden">
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <NextImage
                  src="/logo-icon.png"
                  alt="Aerophantom Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-bold text-2xl">
                Aerophantom
              </span>
            </Link>
            <p className="text-slate-400 max-w-md text-base leading-relaxed mb-6">
              Aerophantom is a robotics education platform that enables
              teachers and institutes to run hands-on training programs with
              complete academic and business support.
            </p>

            <div className="flex flex-col gap-2 mb-7 text-sm text-slate-400">
              <a
                href="tel:+919509206534"
                className="inline-flex items-center gap-2.5 hover:text-primary transition-colors w-fit"
              >
                <PhoneCall className="w-4 h-4 text-primary" /> +91 95092 06534
              </a>
              <a
                href="mailto:support@aerophantom.com"
                className="inline-flex items-center gap-2.5 hover:text-primary transition-colors w-fit"
              >
                <Mail className="w-4 h-4 text-primary" /> support@aerophantom.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/people/AeroPhantom/100088056520354/?mibextid=LQQJ4d&rdid=TZ4C0zeEhsCarFZN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F7gh6GjhsnCapmEps%2F%3Fmibextid%3DLQQJ4d",
                  label: "Facebook",
                },
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/aero_phantom?igsh=MTdmanZjNG5tMG5w&utm_source=qr",
                  label: "Instagram",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/aerophantom/posts/?feedView=all",
                  label: "LinkedIn",
                },
                {
                  icon: Youtube,
                  href: "https://www.youtube.com/@aerophantom-jl7nd",
                  label: "Youtube",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:scale-110 hover:-translate-y-0.5 flex items-center justify-center transition-all duration-300 group/icon"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="w-5 h-5 text-slate-400 group-hover/icon:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {[
                { href: "/#opportunity", label: "Opportunity" },
                { href: "/#challenges", label: "Why Us" },
                { href: "/#journey", label: "Roadmap" },
                { href: "/#included", label: "What's Included" },
                { href: "/#certification", label: "Certification" },
                { href: "/privacy", label: "Privacy Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Head Office */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>Head Office</span>
            </h4>
            <div className="space-y-4">
              <p className="text-slate-400 text-sm leading-relaxed">
                Plot no 57 Balaji Vihar 2 Govindpura Kalwar Road, Jaipur, Rajasthan 302012
              </p>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </div>

              <a
                href="https://maps.google.com/?q=Plot+no+57+Balaji+Vihar+2+Govindpura+Kalwar+Road+Jaipur+Rajasthan+302012"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-semibold transition-all duration-300 w-full justify-center"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 w-full text-center flex justify-center items-center">
          <p className="text-slate-500 text-sm text-center w-full">
            © {new Date().getFullYear()} Aerophantom. All rights reserved.
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-2xl gradient-primary text-primary-foreground shadow-lg shadow-primary/40 hover:scale-110 flex items-center justify-center transition-all duration-300 z-50 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
