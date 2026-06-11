import type { EngagementTier } from "@/types/engagement";
import { handleCTAClick } from "@/lib/tracking";
import FadeIn from "@/components/FadeIn";

interface EngagementCardProps {
  tier: EngagementTier;
  delay?: number;
}

const EngagementCard = ({ tier, delay = 0 }: EngagementCardProps) => {
  return (
    <FadeIn delay={delay}>
      <div
        className={`relative flex flex-col h-full p-8 rounded-xl border ${
          tier.highlighted
            ? "border-gold bg-gold/5 shadow-lg"
            : "border-gray-200 bg-white"
        }`}
      >
        {tier.highlighted && (
          <span className="absolute -top-3 left-8 bg-gold text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        )}

        <div className="mb-6">
          <h3 className="font-serif text-2xl font-medium text-charcoal mb-1">
            {tier.title}
          </h3>
          <p className="text-sm text-gray-500">{tier.subtitle}</p>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-semibold text-charcoal">{tier.priceRange}</p>
          <p className="text-sm text-gray-500 mt-1">{tier.duration}</p>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {tier.description}
        </p>

        <div className="mb-6 flex-grow">
          <p className="text-xs font-semibold text-charcoal uppercase tracking-wide mb-3">
            What's Included
          </p>
          <ul className="space-y-2">
            {tier.deliverables.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-gray-500 mb-4">
            <span className="font-medium">Ideal for:</span> {tier.idealFor}
          </p>
          <a
            href={tier.ctaLink}
            onClick={handleCTAClick("engagement_tier", tier.id)}
            className={`block text-center px-6 py-3 rounded-lg font-medium transition-colors ${
              tier.highlighted
                ? "bg-gold hover:bg-gold-dark text-white"
                : "bg-gray-100 hover:bg-gray-200 text-charcoal"
            }`}
          >
            {tier.cta}
          </a>
        </div>
      </div>
    </FadeIn>
  );
};

export default EngagementCard;
