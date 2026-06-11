import { CheckCircle, XCircle } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useHeroPositioning } from "@/hooks/useFeatureFlag";

const workflowGoodFit = [
  "Ops-heavy teams with recurring reporting or coordination pain",
  "50–2,000 employee organizations or similarly complex environments",
  "Multiple systems already in place (M365, Jira, Confluence, Slack/Teams)",
  "Budget authority or sponsor for a sub-$15k pilot",
  "No appetite for a long transformation program — want results in days, not months",
];

const workflowNotFit = [
  "Generic app builds or custom product development",
  "Vague AI strategy without a specific workflow problem",
  "Low-cost automation or basic chatbot projects",
  "Solo founders looking for cheap tooling",
  "Organization-wide transformation before proving value on one workflow",
];

const fractionalGoodFit = [
  "Growth-stage companies ($10M–$100M) needing technology leadership",
  "CEOs making technology decisions without a dedicated tech executive",
  "Companies with data scattered across 4+ tools and no unified view",
  "Teams that need enterprise-grade architecture at startup speed",
  "PE/VC portfolio companies needing fractional tech leadership across investments",
];

const fractionalNotFit = [
  "Early-stage startups needing a hands-on coder (hire an engineer)",
  "Companies looking for a figurehead CTO who just shows up to board meetings",
  "Organizations wanting a 6-month 'discovery phase' before action",
  "Engagements under $10K/month (can't deliver meaningful executive impact)",
  "Teams that need someone 5 days/week in-office (I embed 2-3 days, remote-flexible)",
];

const FitFilter = () => {
  const positioning = useHeroPositioning();
  const goodFit = positioning === "fractional" ? fractionalGoodFit : workflowGoodFit;
  const notFit = positioning === "fractional" ? fractionalNotFit : workflowNotFit;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal text-center mb-16">
            Best Fit
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FadeIn delay={0.1}>
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-charcoal mb-6">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Right For
              </h3>
              <ul className="space-y-3">
                {goodFit.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
                  >
                    <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-charcoal mb-6">
                <XCircle className="w-5 h-5 text-gray-400" />
                Not Right For
              </h3>
              <ul className="space-y-3">
                {notFit.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-gray-500 leading-relaxed"
                  >
                    <span className="text-gray-400 mt-0.5 flex-shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default FitFilter;
