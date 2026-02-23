"use client";

import Navbar from "@/features/site/navbar";
import Footer from "@/features/site/footer";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-zinc-900 shadow-xl rounded-3xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>

            <div className="space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  1. Introduction
                </h2>
                <p>
                  Aerophantom (“Company”, “we”, “our”, or “us”) respects your
                  privacy and is committed to protecting your personal
                  information.
                </p>
                <p className="mt-2">
                  This Privacy Policy explains how we collect, use, store, and
                  protect your information when you visit our website, register
                  for our Educator Training Program, or use our platform and
                  services.
                </p>
                <p className="mt-2">
                  By accessing our website or using our services, you agree to
                  the terms of this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  2. Information We Collect
                </h2>
                <p>We may collect the following types of information:</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-primary italic">
                      a) Personal Information
                    </h3>
                    <p className="mt-1">
                      When you register, enroll, or contact us, we may collect:
                    </p>
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Full Name</li>
                      <li>Phone Number</li>
                      <li>Email Address</li>
                      <li>City and State</li>
                      <li>Educational Qualification</li>
                      <li>Professional Information</li>
                      <li>
                        Payment Details (processed via secure third-party
                        providers)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary italic">
                      b) Account and Platform Information
                    </h3>
                    <p className="mt-1">When you use our platform:</p>
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>Login credentials</li>
                      <li>Course progress</li>
                      <li>Student enrollment information (for educators)</li>
                      <li>Training and certification data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary italic">
                      c) Technical Information
                    </h3>
                    <p className="mt-1">We may automatically collect:</p>
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                      <li>IP address</li>
                      <li>Browser type</li>
                      <li>Device information</li>
                      <li>Website usage data</li>
                    </ul>
                    <p className="mt-2 text-sm italic">
                      This helps us improve our services.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  3. How We Use Your Information
                </h2>
                <p>We use your information to:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Provide access to training programs</li>
                  <li>Create and manage your educator account</li>
                  <li>Deliver course content and certification</li>
                  <li>Provide educator and student support</li>
                  <li>Process payments</li>
                  <li>Provide marketing and program support</li>
                  <li>Improve our platform and services</li>
                  <li>Communicate important updates</li>
                </ul>
                <p className="mt-4 font-semibold text-primary italic">
                  We do not sell your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  4. Information Sharing
                </h2>
                <p>We do not sell, rent, or trade your personal information.</p>
                <p className="mt-2">We may share information only with:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>
                    Trusted service providers (payment processors, platform
                    providers)
                  </li>
                  <li>Legal authorities if required by law</li>
                  <li>Internal team members for operational purposes</li>
                </ul>
                <p className="mt-2 text-sm italic">
                  All partners are required to keep your information secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  5. Student and Educator Data Protection
                </h2>
                <p>
                  Aerophantom provides platform support to educators. Educators
                  may manage student information through the platform.
                </p>
                <p className="mt-2">We take reasonable steps to protect:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Student data</li>
                  <li>Educator data</li>
                  <li>Training information</li>
                </ul>
                <p className="mt-4 text-sm italic text-zinc-500">
                  However, educators are responsible for maintaining
                  confidentiality of their account access.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  6. Payment Security
                </h2>
                <p>
                  Payments are processed through secure third-party payment
                  gateways. Aerophantom does not store your card or banking
                  information on its servers. All transactions are encrypted and
                  processed securely.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  7. Data Storage and Security
                </h2>
                <p>
                  We implement appropriate security measures to protect your
                  data from unauthorized access, loss, misuse, or alteration.
                  However, no system is 100% secure, and users share information
                  at their own risk.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  8. Cookies and Tracking
                </h2>
                <p>
                  Our website may use cookies to improve user experience,
                  understand website usage, and enhance platform performance.
                  You can disable cookies in your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  9. Your Rights
                </h2>
                <p>
                  You have the right to access your personal information,
                  request correction of incorrect information, or request
                  deletion of your account (subject to program terms). You can
                  contact us for such requests.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  10. Program and Business Model Disclaimer
                </h2>
                <p>
                  Aerophantom provides educator training, curriculum, hardware
                  support, and platform access. Educators operate independently
                  and are responsible for their own teaching activities and
                  student enrollments. Aerophantom does not guarantee specific
                  income or student enrollment.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  11. Third-Party Links
                </h2>
                <p>
                  Our website may contain links to third-party websites. We are
                  not responsible for their privacy practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  12. Updates to Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. Updated
                  versions will be posted on this page.
                </p>
              </section>

              <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 border-b pb-2">
                  13. Contact Us
                </h2>
                <p>If you have any questions, contact:</p>
                <div className="mt-4 space-y-2">
                  <p className="font-bold">Aerophantom</p>
                  <p>Email: info@aerophantom.com</p>
                  <p>Website: training.aerophantom.com</p>
                  <p className="mt-4">
                    Address: Plot no 57 Balaji Vihar 2 Govindpura Kalwar Road
                    <br />
                    Jaipur, Rajasthan 302012
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
