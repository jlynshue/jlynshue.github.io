import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/FadeIn";

const engagements = [
  {
    number: "01",
    title: "Real-Time Perception System for QSR",
    badge: "Edge AI",
    description:
      "Designed and governed the engineering infrastructure for a real-time computer vision pipeline processing 10,000+ daily drive-through transactions at sub-300ms latency. Edge-first architecture on NVIDIA Jetson with private LTE connectivity.",
    outcomes: [
      "Sub-300ms end-to-end processing loop",
      "+2 cars/hour throughput improvement",
      "100% uptime during October 2025 AWS outage",
    ],
  },
  {
    number: "02",
    title: "Enterprise Analytics Governance",
    badge: "Fortune 100",
    description:
      "Led analytics governance and data strategy across 15+ brand sites for a Fortune 100 agency. Built automated QA pipelines, tagging validation frameworks, and cross-team coordination processes.",
    outcomes: [
      "15+ brand sites under unified governance",
      "Automated QA cutting manual review by 60%",
      "Sprint coordination across distributed teams",
    ],
  },
  {
    number: "03",
    title: "MCP Orchestration Platform",
    badge: "Infrastructure",
    description:
      "Deployed an 8-server Model Context Protocol orchestration layer unifying Jira, Microsoft 365, analytics platforms, and task management into a single AI-accessible workflow.",
    outcomes: [
      "8 MCP servers with profile-based routing",
      "Unified task aggregation across platforms",
      "Keychain-based credential management",
    ],
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-charcoal mb-4">
            Select Engagements
          </h2>
          <p className="text-gray-500 mb-16 text-lg">
            Outcomes from recent work — anonymized where required by NDA.
          </p>
        </FadeIn>

        <div className="space-y-16">
          {engagements.map((engagement, index) => (
            <FadeIn key={engagement.number} delay={index * 0.1}>
              <div>
                <div className="flex items-start gap-6 mb-6">
                  <span className="font-serif text-5xl font-light text-gold/40">
                    {engagement.number}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-serif text-2xl font-semibold text-charcoal">
                        {engagement.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-gold/10 text-gold-dark border-0 font-medium"
                      >
                        {engagement.badge}
                      </Badge>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {engagement.description}
                    </p>
                    <div className="space-y-2">
                      {engagement.outcomes.map((outcome) => (
                        <div
                          key={outcome}
                          className="flex items-center text-sm text-gray-500"
                        >
                          <span className="w-1.5 h-1.5 bg-gold rounded-full mr-3 flex-shrink-0" />
                          {outcome}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index < engagements.length - 1 && <Separator className="mt-8" />}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
