import FadeIn from "@/components/FadeIn";
import { discoveryCallHref, handleCTAClick } from "@/lib/tracking";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium text-charcoal leading-[1.1] tracking-tight mb-8">
            Executive workflow systems that deliver clarity, not noise.
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 font-light max-w-3xl mx-auto">
            One bottleneck. Ten business days. Built inside your existing stack.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={discoveryCallHref("hero")}
              onClick={handleCTAClick("discovery_call", "hero")}
              className="inline-flex items-center px-8 py-4 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors text-lg"
            >
              Schedule a Discovery Call
            </a>
            <a
              href="/sprint"
              onClick={handleCTAClick("sprint_page", "hero")}
              className="inline-flex items-center px-8 py-4 border border-gray-300 hover:border-gray-400 text-charcoal font-medium rounded-lg transition-colors text-lg"
            >
              See How The Sprint Works
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
