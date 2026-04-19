import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/FadeIn";

const offers = [
  {
    name: "Workflow Diagnostic",
    price: "$2,500",
    duration: "3 business days",
    description:
      "Map one workflow, quantify waste, and define the implementation path. Fee credited toward the sprint if you proceed within 7 days.",
    deliverables: [
      "Workflow map of current state",
      "Bottleneck and waste analysis",
      "Source system boundary map",
      "Recommended target workflow",
      "Implementation path",
    ],
  },
  {
    name: "Executive Workflow Sprint",
    price: "$12,000",
    duration: "10 business days",
    description:
      "Implement one workflow end to end across your existing systems. One workflow, max 4 systems, max 2 user roles.",
    deliverables: [
      "Working workflow with source-linked output",
      "Action-routing logic",
      "Admin runbook and fallback path",
      "Adoption handoff and documentation",
    ],
    featured: true,
  },
  {
    name: "Workflow Tuning Retainer",
    price: "$3,500/mo",
    duration: "Ongoing",
    description:
      "Stabilize and expand successful workflow systems. Monitoring, prompt refinements, and one incremental improvement per month.",
    deliverables: [
      "Monitoring and tuning",
      "One workflow improvement per month",
      "Adoption support",
    ],
  },
];

const OfferSection = () => {
  return (
    <section id="offer" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal text-center mb-4">
            The Executive Workflow Sprint
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            A fixed-scope engagement that removes one recurring bottleneck — not a vague transformation project.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div
                className={`flex flex-col p-8 rounded-xl bg-white border ${
                  offer.featured
                    ? "border-gold shadow-lg ring-1 ring-gold/20"
                    : "border-gray-100"
                } h-full`}
              >
                {offer.featured && (
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="font-serif text-xl font-medium text-charcoal mb-1">
                  {offer.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-semibold text-charcoal">
                    {offer.price}
                  </span>
                </div>
                <span className="text-sm text-gray-400 mb-4">
                  {offer.duration}
                </span>
                <Separator className="mb-4" />
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {offer.description}
                </p>
                <ul className="space-y-2 flex-1">
                  {offer.deliverables.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-gold mt-0.5">✓</span>
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
  );
};

export default OfferSection;
