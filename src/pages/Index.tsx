import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BrandStrip from "@/components/BrandStrip";
import Services from "@/components/Services";
import OfferSection from "@/components/OfferSection";
import Approach from "@/components/Approach";
import WorkSection from "@/components/WorkSection";
import FitFilter from "@/components/FitFilter";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* 1. Hero — what you do, who it's for, CTA */}
      <HeroSection />
      {/* 2. Proof Strip — credibility signals */}
      <BrandStrip />
      {/* 3. Problem — where executive workflows break */}
      <Services />
      {/* 4. Offer — the Executive Workflow Sprint */}
      <OfferSection />
      {/* 5. How It Works — discovery → diagnostic → sprint → retainer */}
      <Approach />
      {/* 6. Engagement Examples — operating proof */}
      <WorkSection />
      {/* 7. Fit Filter — right for / not right for */}
      <FitFilter />
      {/* 8. Contact CTA — schedule a discovery call */}
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
