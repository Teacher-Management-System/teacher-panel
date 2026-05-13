"use client";

import Navbar from "@/features/site/navbar";
import Footer from "@/features/site/footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  BookOpen,
  Cpu,
  GraduationCap,
  TrendingUp,
  Megaphone,
  Monitor,
  ShieldAlert,
} from "lucide-react";

const faqData = [
  {
    category: "General Program",
    icon: HelpCircle,
    questions: [
      {
        q: "What is the Aerophantom Educator Training Program?",
        a: "The Aerophantom Educator Training Program is designed to help teachers and educators start their own Robotics Training Program in their area. Aerophantom provides complete training, curriculum, robotics training hardware and components, platform access, certification, and marketing support.",
      },
      {
        q: "Who can join this program?",
        a: "This program is suitable for School Teachers, Tuition Teachers, Educators, Engineering Students, Technical Professionals, and anyone interested in teaching robotics. No prior robotics experience is mandatory.",
      },
      {
        q: "Do I need prior knowledge of robotics?",
        a: "No. The program includes complete step-by-step training from beginner to advanced level. You will learn everything required to teach students confidently.",
      },
      {
        q: "Is this a job or a business opportunity?",
        a: "This is not a job. This program enables you to start and operate your own Robotics Training Program independently with Aerophantom’s support.",
      },
    ],
  },
  {
    category: "Training Related",
    icon: BookOpen,
    questions: [
      {
        q: "How long is the teacher training program?",
        a: "The educator training program is conducted over 15 days and includes practical learning, projects, and doubt support sessions.",
      },
      {
        q: "Will I receive practical training?",
        a: "Yes. You will receive robotics training hardware and components, and the training includes hands-on practical projects.",
      },
      {
        q: "Will I receive certification after training?",
        a: "Yes. After successfully completing the training, you will receive an official Aerophantom Educator Certification.",
      },
      {
        q: "What if I have doubts during or after training?",
        a: "Aerophantom provides continuous support. You can contact the support team for guidance whenever required.",
      },
    ],
  },
  {
    category: "Hardware, Curriculum, & Teaching",
    icon: Cpu,
    questions: [
      {
        q: "Will Aerophantom provide curriculum and teaching materials?",
        a: "Yes. Aerophantom provides complete curriculum, teaching structure, student projects, and training resources. You do not need to create your own curriculum.",
      },
      {
        q: "Will I receive robotics hardware and components?",
        a: "Yes. You will receive all required robotics training hardware and components needed for training and teaching students.",
      },
      {
        q: "Do I need to set up a robotics lab?",
        a: "No. You can start from your home, tuition center, or any available space. A full lab setup is not mandatory.",
      },
    ],
  },
  {
    category: "Student & Teaching",
    icon: GraduationCap,
    questions: [
      {
        q: "How will students receive training?",
        a: "Students receive practical training from you, video learning access, study materials, and certification after course completion.",
      },
      {
        q: "How many students can I teach?",
        a: "You can start with even 1 student and gradually increase based on your capacity. There is no fixed limit.",
      },
      {
        q: "Will Aerophantom provide student kits?",
        a: "Yes. Aerophantom provides required student hardware and learning materials.",
      },
    ],
  },
  {
    category: "Earnings & Business Model",
    icon: TrendingUp,
    questions: [
      {
        q: "How do educators earn income?",
        a: "Educators earn teaching income based on the number of students they train. Your earnings increase as your student enrollments increase.",
      },
      {
        q: "Is there any fixed salary?",
        a: "No. This is not a salaried job. Your income depends on your teaching activity and student enrollments.",
      },
      {
        q: "Is student enrollment guaranteed?",
        a: "Aerophantom provides marketing support and guidance, but student enrollment depends on your efforts and local response.",
      },
    ],
  },
  {
    category: "Marketing & Support",
    icon: Megaphone,
    questions: [
      {
        q: "Will Aerophantom help with marketing?",
        a: "Yes. Aerophantom provides marketing materials, posters and brochures, presentation support, social media content, and parent explanation support.",
      },
      {
        q: "Will I get support after joining?",
        a: "Yes. Aerophantom provides continuous support to help you start and grow your training program.",
      },
    ],
  },
  {
    category: "Platform & Technical",
    icon: Monitor,
    questions: [
      {
        q: "Will I get platform access?",
        a: "Yes. You will receive access to the Aerophantom platform to manage students and training.",
      },
      {
        q: "Will students receive online access?",
        a: "Yes. Students receive access to learning videos and course materials.",
      },
    ],
  },
  {
    category: "Investment & Risk",
    icon: ShieldAlert,
    questions: [
      {
        q: "Do I need to invest in lab setup?",
        a: "No. The program is designed so you can start without heavy lab investment.",
      },
      {
        q: "Is this program suitable for part-time?",
        a: "Yes. You can run this program part-time alongside your current profession.",
      },
    ],
  },
];

export default function FAQClient() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Everything you need to know about the Aerophantom Educator
              Training Program
            </p>
          </motion.div>

          <div className="space-y-12">
            {faqData.map((category, catIdx) => (
              <motion.section
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {category.category}
                  </h2>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-3"
                >
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem
                      key={qIdx}
                      value={`${catIdx}-${qIdx}`}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 data-[state=open]:shadow-md transition-all"
                    >
                      <AccordionTrigger className="text-left text-lg font-semibold text-zinc-900 dark:text-zinc-50 hover:no-underline hover:text-primary py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed pb-6">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 p-8 bg-primary rounded-3xl text-center text-white shadow-xl shadow-primary/20"
          >
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="mb-6 opacity-90">
              We're here to help you start your journey in robotics education.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="mailto:info@aerophantom.com"
                className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-zinc-100 transition-colors"
              >
                Email Us
              </a>
              <a
                href="tel:+91XXXXXXXXXX"
                className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors"
              >
                Call Support
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
