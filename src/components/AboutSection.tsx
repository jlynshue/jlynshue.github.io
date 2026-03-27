import FadeIn from "@/components/FadeIn";

const AboutSection = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-charcoal mb-8">
            Let's work together.
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="text-lg text-gray-600 leading-relaxed mb-12 max-w-3xl space-y-4">
            <p>
              I'm a technology leader with 15+ years building data products, AI systems, and engineering teams
              for brands like Stellantis, Marriott, Samsung, and Southern Wine & Spirits.
              Currently CIO at Anuba Technologies (edge AI for QSR) and independent technology consultant.
            </p>
            <p>
              Previously Director of Data Instrumentation & Architecture at Razorfish (Publicis Groupe),
              where I led data science and engineering teams across enterprise analytics, data architecture,
              and product strategy for Fortune 500 clients.
            </p>
            <p>
              I take on a limited number of engagements at a time — typically fractional CIO roles,
              AI consulting projects, or focused technical builds. If you're building something ambitious
              and need both strategic thinking and hands-on execution, let's talk.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="https://calendly.com/jonathan-lynshue-anubatechnologies/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors"
            >
              Schedule a Discovery Call
            </a>
            <a
              href="mailto:hello@jonathanlynshue.com"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-medium rounded-lg transition-colors"
            >
              hello@jonathanlynshue.com
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex gap-6 text-sm text-gray-400">
            <a
              href="https://linkedin.com/in/jonathanlynshue"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-charcoal transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/jlynshue"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-charcoal transition-colors"
            >
              GitHub
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
