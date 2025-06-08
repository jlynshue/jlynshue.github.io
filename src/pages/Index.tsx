import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import WorkSection from "@/components/WorkSection";
import LeadershipSection from "@/components/LeadershipSection";
import StrategySection from "@/components/StrategySection";
import CollaborationSection from "@/components/CollaborationSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProjectShowcase />
      <WorkSection />
      <LeadershipSection />
      <StrategySection />
      <CollaborationSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
