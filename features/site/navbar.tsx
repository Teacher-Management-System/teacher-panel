"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Why Us", href: "/#challenges" },
    { name: "For Whom", href: "/#who-is-for" },
    { name: "Roadmap", href: "/#journey" },
    { name: "Included", href: "/#included" },
    { name: "Projects", href: "/#projects" },
    { name: "Certification", href: "/#certification" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white backdrop-blur-xl shadow-md border-b border-border/50"
          : "bg-white border-b border-border/30"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center"
              whileHover={{ scale: 1.08, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
            >
              <NextImage
                src="/logo-icon.png"
                alt="Aerophantom Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </motion.div>
            <span className="font-display font-bold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
              Aerophantom
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {!isLoading && (
              <>
                {user ? (
                  <Button
                    variant="default"
                    asChild
                    className="rounded-full shadow-lg shadow-primary/25 px-6"
                  >
                    <Link href="/dashboard">
                      Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    asChild
                    className="rounded-full shadow-lg shadow-primary/30 px-6"
                  >
                    <Link href="/inquiry">
                      Inquire Now <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2.5 rounded-xl bg-muted/70 border border-border/60 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/50 rounded-b-2xl"
            >
              <div className="px-4 py-4">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  <div className="flex flex-col gap-2 mt-3 pt-4 border-t border-border">
                    {!isLoading && (
                      <>
                        {user ? (
                          <Button
                            variant="default"
                            asChild
                            className="w-full rounded-xl"
                          >
                            <Link
                              href="/dashboard"
                              onClick={() => setIsOpen(false)}
                            >
                              Dashboard
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            asChild
                            className="w-full rounded-xl shadow-lg shadow-primary/25"
                          >
                            <Link
                              href="/inquiry"
                              onClick={() => setIsOpen(false)}
                            >
                              Inquire Now
                            </Link>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
