import { FileWarning, Clock, MessageSquareOff, ShieldAlert } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const painPoints = [
  {
    icon: FileWarning,
    title: "Manual Reporting Assembly",
    description:
      "Weekly leadership readouts are stitched together from too many systems — Jira, Confluence, Slack, docs, spreadsheets.",
  },
  {
    icon: Clock,
    title: "Delayed Decisions",
    description:
      "Important decisions get held up because the evidence is scattered across tickets, meetings, docs, and chat.",
  },
  {
    icon: MessageSquareOff,
    title: "Lost Action Items",
    description:
      "Action items die between meetings, documents, and messaging. Nobody owns the handoff.",
  },
  {
    icon: ShieldAlert,
    title: "Untrusted AI Outputs",
    description:
      "Teams don't trust automated summaries or reports because they aren't source-linked or reviewed.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal text-center mb-4">
            Where Executive Workflows Break
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            The tools are usually fine. The workflow between them is the problem.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {painPoints.map((point, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="flex gap-4 p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex-shrink-0">
                  <point.icon className="w-6 h-6 text-gold mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
