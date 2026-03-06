import FadeIn from "@/components/FadeIn";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium text-charcoal leading-[1.1] tracking-tight mb-8">
            I help companies build the systems that make AI actually work.
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 font-light">
            Fractional CIO. Edge AI architect. Full-stack builder.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors text-lg"
          >
            Schedule a Discovery Call
          </a>
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
