import { CheckCircle, XCircle } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const goodFit = [
  "Ops-heavy teams with recurring reporting or coordination pain",
  "50–2,000 employee organizations or similarly complex environments",
  "Multiple systems already in place (M365, Jira, Confluence, Slack/Teams)",
  "Budget authority or sponsor for a sub-$15k pilot",
  "No appetite for a long transformation program — want results in days, not months",
];

const notFit = [
  "Generic app builds or custom product development",
  "Vague AI strategy without a specific workflow problem",
  "Low-cost automation or basic chatbot projects",
  "Solo founders looking for cheap tooling",
  "Organization-wide transformation before proving value on one workflow",
];

const FitFilter = () => {
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
