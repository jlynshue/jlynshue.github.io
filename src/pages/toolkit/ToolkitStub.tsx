import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import NotFound from "@/pages/NotFound";
import { Separator } from "@/components/ui/separator";
import {
  discoveryCallHref,
  handleCTAClick,
  leadMagnetHref,
} from "@/lib/tracking";
import {
  TEMPLATE_COPY,
  familiesGridClass,
  getToolkitProduct,
  heroPlacement,
  ladderPlacement,
  priceAmount,
  sampleLabel,
} from "./products";

/**
 * Stub landing page for `/toolkit/:slug`, rendered from the product registry.
 *
 * Two CTAs, deliberately different:
 *  - hero    -> /r/lead-magnet  (waitlist; this is what demand is measured on)
 *  - closing -> /r/discovery-call  (the ladder CTA, mirroring Sprint/Diagnostic)
 *
 * An unknown slug renders the 404 page rather than an empty shell, so a bad link
 * fails visibly instead of looking like a product with no content.
 */
const ToolkitStub = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getToolkitProduct(slug);

  if (!product) {
    // The `brand wp` wrapper is required, not decorative. Every design token
    // (--paper, --serif, --s-*, --heat) is declared on `.brand` in
    // Redesign.css, NotFound.css only consumes them, and `.nf-page` is
    // `background: transparent` — so a bare <NotFound /> outside `.brand`
    // resolves no variable and paints dark text on white. Elsewhere the app
    // gets this ancestor from WallpaperLayout; this route deliberately does not
    // use that layout, so it has to supply the context itself. `wp` is what
    // carries the dark backdrop; the wallpaper canvas is not needed for it.
    return (
      <div className="brand wp">
        <NotFound />
      </div>
    );
  }

  // Both placements are derived in products.ts so they can be asserted there.
  // Safe to rename: /toolkit/<slug> answers 404 in production today, so no
  // toolkit placement has ever been emitted and there is no history to break.
  const hero = heroPlacement(product);
  const ladder = ladderPlacement(product);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal leading-tight mb-6">
              {product.headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-500 mb-8">{product.subhead}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="inline-flex items-baseline gap-2 text-charcoal mb-4">
              <span className="text-3xl font-semibold">
                {priceAmount(product)}
              </span>
              <span className="text-gray-400">{product.priceNote}</span>
            </div>
            <p className="text-sm text-gold font-medium mb-8">
              {product.priceKicker}
            </p>
            <a
              href={leadMagnetHref(product.slug, hero)}
              onClick={handleCTAClick("lead_magnet", hero)}
              className="inline-flex items-center px-10 py-5 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors text-lg"
            >
              {TEMPLATE_COPY.heroCta}
            </a>
          </FadeIn>
        </div>
      </section>

      {/* The problem */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-8">
              {product.problem.heading}
            </h2>
            {product.problem.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-500 text-center mb-4 last:mb-0 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* What it covers */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-16">
              {product.families.heading}
            </h2>
          </FadeIn>

          <div className={familiesGridClass(product)}>
            {product.families.groups.map((group, index) => (
              <FadeIn key={group.label} delay={index * 0.1}>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 h-full">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {group.label}
                  </span>
                  <h3 className="font-semibold text-charcoal text-lg mt-2 mb-4">
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-500"
                      >
                        <span className="text-gold mt-0.5">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-12">
              {product.included.heading}
            </h2>
          </FadeIn>

          <div className="bg-white rounded-xl border border-gray-100 p-8">
            {product.included.items.map((item, index) => (
              <FadeIn key={item} delay={index * 0.05}>
                <div className="flex items-start gap-3 py-3">
                  <span className="text-gold mt-0.5">✓</span>
                  <p className="text-gray-600">{item}</p>
                </div>
                {index < product.included.items.length - 1 && <Separator />}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sample */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="bg-gray-50 rounded-r-xl border border-gray-100 border-l-4 border-l-gold p-8">
              <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                {sampleLabel(product)}
              </p>
              <h3 className="font-semibold text-charcoal text-lg mb-3">
                {product.sample.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.sample.body}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-12">
              {TEMPLATE_COPY.faqHeading}
            </h2>
          </FadeIn>

          <dl className="bg-white rounded-xl border border-gray-100 p-8">
            {product.faq.map((entry, index) => (
              <FadeIn key={entry.question} delay={index * 0.05}>
                <dt className="font-semibold text-charcoal mb-2">
                  {entry.question}
                </dt>
                <dd className="text-gray-500 text-sm leading-relaxed mb-0">
                  {entry.answer}
                </dd>
                {index < product.faq.length - 1 && (
                  <div className="py-4">
                    <Separator />
                  </div>
                )}
              </FadeIn>
            ))}
          </dl>
        </div>
      </section>

      {/* Ladder CTA */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium mb-4">
              {product.closing.heading}
            </h2>
            <p className="text-gray-300 mb-10">{product.closing.body}</p>
            <a
              href={discoveryCallHref(ladder)}
              onClick={handleCTAClick("discovery_call", ladder)}
              className="inline-flex items-center px-10 py-5 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors text-lg"
            >
              {TEMPLATE_COPY.ladderCta}
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ToolkitStub;
