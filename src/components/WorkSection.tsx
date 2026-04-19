import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/FadeIn";

const engagements = [
  {
    number: "01",
    title: "Real-Time Perception System for QSR",
    badge: "Edge AI · Governance",
    description:
      "Designed and governed the engineering infrastructure for a real-time computer vision pipeline delivering sub-300ms recognition-to-prediction loops across edge-deployed drive-through systems.",
    outcomes: [
      "Sub-300ms end-to-end processing loop",
      "+2 cars/hour throughput improvement",
      "100% uptime during October 2025 AWS outage",
    ],
    systems: "NVIDIA Jetson · Private LTE · AWS · Custom ML Pipeline",
  },
  {
    number: "02",
    title: "Enterprise Data Architecture — Stellantis",
    badge: "Analytics · Governance",
    description:
      "Led data instrumentation, architecture, and product development for Stellantis. Managed CRM and Data Science pods, built analytics governance frameworks across a multi-brand enterprise ecosystem.",
    outcomes: [
      "Unified analytics governance across 14 brands",
      "First-party data strategy driving $50M+ in attributable media spend",
      "Cross-functional alignment between engineering, analytics, and marketing",
    ],
    systems: "Adobe Analytics · Salesforce · Snowflake · Tealium",
  },
  {
    number: "03",
    title: "Cross-System Workflow Integration",
    badge: "Workflow · Operations",
    description:
      "Built executive reporting and coordination workflows across fragmented tool stacks — reducing manual status assembly and improving decision-making speed for operations teams.",
    outcomes: [
      "50%+ reduction in manual reporting prep time",
      "Source-linked outputs trusted by leadership",
      "Reusable workflow patterns across multiple teams",
    ],
    systems: "Microsoft 365 · Jira · Confluence · Slack · Teams",
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal text-center mb-4">
            Operating Proof
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            Real systems built, governed, and delivered — not proposals.
          </p>
        </FadeIn>

        <div className="space-y-12">
          {engagements.map((engagement, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="bg-white rounded-xl border border-gray-100 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm text-gray-400 font-mono">
                      {engagement.number}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-charcoal mt-1">
                      {engagement.title}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium text-gray-500 border-gray-200 flex-shrink-0"
                  >
                    {engagement.badge}
                  </Badge>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {engagement.description}
                </p>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Outcomes
                    </h4>
                    <ul className="space-y-1">
                      {engagement.outcomes.map((outcome, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <span className="text-gold mt-0.5">→</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Systems
                    </h4>
                    <p className="text-sm text-gray-500">
                      {engagement.systems}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
