import Navbar from "./navbar";
import HeroSection from "./hero-section";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const OpportunitySection = dynamic(() => import("./opportunity-section"));
const ChallengesSection = dynamic(() => import("./challenges-section"));
const WhoIsForSection = dynamic(() => import("./who-is-for-section"));
const IntroducingProgramSection = dynamic(() => import("./introducing-program-section"));
const DifferentSection = dynamic(() => import("./different-section"));
const LearningJourneySection = dynamic(() => import("./learning-journey-section"));
const IncludedSection = dynamic(() => import("./included-section"));
const LearnByBuildingSection = dynamic(() => import("./learn-by-building-section"));
const PostProgramSection = dynamic(() => import("./post-program-section"));
const CertificationSection = dynamic(() => import("./certification-section"));
const WhyAerophantomSection = dynamic(() => import("./why-aerophantom-section"));
const FAQSection = dynamic(() => import("./faq-section"));
const FinalCTASection = dynamic(() => import("./final-cta-section"));
const Footer = dynamic(() => import("./footer"));

const SectionFallback = () => (
  <div className="min-h-[300px] animate-pulse bg-muted/10 rounded-2xl m-4" />
);

export function SiteMain() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* SECTION 1 - Hero */}
      <HeroSection />

      {/* SECTION 2 - Opportunity */}
      <Suspense fallback={<SectionFallback />}>
        <OpportunitySection />
      </Suspense>

      {/* SECTION 3 - Challenges */}
      <Suspense fallback={<SectionFallback />}>
        <ChallengesSection />
      </Suspense>

      {/* SECTION 4 - Who is it for */}
      <Suspense fallback={<SectionFallback />}>
        <WhoIsForSection />
      </Suspense>

      {/* SECTION 5 - Introducing Program */}
      <Suspense fallback={<SectionFallback />}>
        <IntroducingProgramSection />
      </Suspense>

      {/* SECTION 6 - What makes program different */}
      <Suspense fallback={<SectionFallback />}>
        <DifferentSection />
      </Suspense>

      {/* SECTION 7 - Learning Journey Timeline */}
      <Suspense fallback={<SectionFallback />}>
        <LearningJourneySection />
      </Suspense>

      {/* SECTION 8 - Everything Included Grid */}
      <Suspense fallback={<SectionFallback />}>
        <IncludedSection />
      </Suspense>

      {/* SECTION 9 - Learn by Building Gallery */}
      {/* <Suspense fallback={<SectionFallback />}>
        <LearnByBuildingSection />
      </Suspense> */}

      {/* SECTION 10 - After Program Outcomes */}
      <Suspense fallback={<SectionFallback />}>
        <PostProgramSection />
      </Suspense>

      {/* SECTION 11 - Certificate Mockup */}
      {/* <Suspense fallback={<SectionFallback />}>
        <CertificationSection />
      </Suspense> */}

      {/* SECTION 12 - Why Aerophantom */}
      <Suspense fallback={<SectionFallback />}>
        <WhyAerophantomSection />
      </Suspense>

      {/* SECTION 13 - FAQs Accordion */}
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>

      {/* FINAL SECTION - Final CTA */}
      <Suspense fallback={<SectionFallback />}>
        <FinalCTASection />
      </Suspense>

      {/* FOOTER */}
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </main>
  );
}
