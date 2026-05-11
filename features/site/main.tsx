import Navbar from "./navbar";
import HeroSection from "./hero-section";
import OpportunitySection from "./opportunity-section";
import ChallengesSection from "./challenges-section";
import SolutionSection from "./solution-section";
import CurriculumSection from "./curriculum-section";
import LearningApproachSection from "./learning-approach-section";
import ResourcesSection from "./resources-section";
import HowItWorksSection from "./how-it-works-section";
import FinalCTASection from "./final-cta-section";
import AboutSection from "./about-section";
import Footer from "./footer";

export function SiteMain() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <OpportunitySection />
      <ChallengesSection />
      <SolutionSection />
      <CurriculumSection />
      <LearningApproachSection />
      <ResourcesSection />
      <HowItWorksSection />
      <FinalCTASection />
      <AboutSection />
      <Footer />
    </main>
  );
}
