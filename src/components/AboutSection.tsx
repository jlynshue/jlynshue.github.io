import FadeIn from "@/components/FadeIn";
import { discoveryCallHref, handleCTAClick } from "@/lib/tracking";

const AboutSection = () => {
  return (
    <section id="contact" className="py-24 bg-charcoal text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">
            Schedule a Discovery Call
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            30 minutes. No pitch deck. Let's see if the fit is there.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <a
            href={discoveryCallHref("contact-section")}
            onClick={handleCTAClick("discovery_call", "contact-section")}
            className="inline-flex items-center px-10 py-5 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors text-lg"
          >
            Schedule a Discovery Call
          </a>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-gray-500 text-sm mt-8">
            Currently accepting new engagements for Q2 2026.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
