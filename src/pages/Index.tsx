import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BrandStrip from "@/components/BrandStrip";
import Services from "@/components/Services";
import WorkSection from "@/components/WorkSection";
import Approach from "@/components/Approach";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <BrandStrip />
      <Services />
      <WorkSection />
      <Approach />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
