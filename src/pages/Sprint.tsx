import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { Separator } from "@/components/ui/separator";
import { discoveryCallHref } from "@/lib/tracking";

const sprintDays = [
  {
    days: "Days 1–2",
    title: "Lock Workflow Spec",
    items: [
      "Finalize workflow scope and success criteria",
      "Confirm source systems and output structure",
      "Align on user roles and action-routing logic",
    ],
  },
  {
    days: "Days 3–6",
    title: "Build & Integrate",
    items: [
      "Integrate source systems (M365, Jira, Confluence, Slack/Teams)",
      "Build synthesis and output layer",
      "Implement action-routing and handoff logic",
    ],
  },
  {
    days: "Days 7–8",
    title: "Validate & Harden",
    items: [
      "Validate output quality against real data",
      "Add human review steps and fallback paths",
      "Source-link every data point for trust",
    ],
  },
  {
    days: "Days 9–10",
    title: "Handoff & Adopt",
    items: [
      "Live demo with stakeholders",
      "Admin runbook and documentation",
      "Adoption checklist and manual fallback path",
    ],
  },
];

const workflowTypes = [
  "Weekly executive status readout",
  "Leadership decision brief generation",
  "Cross-functional handoff routing",
  "Risk and blocker escalation flow",
  "Program portfolio rollup from tickets, docs, and meetings",
];

const included = [
  "One workflow only",
  "Max 4 connected systems",
  "Max 2 user roles",
  "One primary output surface",
  "One action-routing pattern",
  "Documentation and handoff",
];

const excluded = [
  "Org-wide process redesign",
  "Custom model training",
  "Data warehouse build-out",
  "Full internal platform engineering",
  "Broad change-management program",
  "Multiple independent workflows in one sprint",
];

const outcomes = [
  { metric: "50%+", description: "Reduction in manual prep time" },
  { metric: "Same-day", description: "Time-to-readout (from days)" },
  { metric: "Consistent", description: "Repeatable weekly output" },
  { metric: "Source-linked", description: "Trusted by leadership" },
];

const Sprint = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal leading-tight mb-6">
              The Executive Workflow Sprint
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-500 mb-8">
              One workflow. Ten business days. Implemented inside your existing
              stack.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="inline-flex items-baseline gap-2 text-charcoal">
              <span className="text-3xl font-semibold">$12,000</span>
              <span className="text-gray-400">· 10 business days</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Day-by-Day Breakdown */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-16">
              How The Sprint Works
            </h2>
          </FadeIn>

          <div className="space-y-10">
            {sprintDays.map((phase, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-sm font-semibold text-gold">
                      {phase.days}
                    </span>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-semibold text-charcoal text-lg mb-3">
                      {phase.title}
                    </h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-500"
                        >
                          <span className="text-gold mt-0.5">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Default Workflow Types */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-4">
              Workflow Types That Fit
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              These are better fits than generic chatbot or knowledge-base
              builds because they are tied to repeatable pain and visible ROI.
            </p>
          </FadeIn>

          <div className="max-w-lg mx-auto">
            {workflowTypes.map((type, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <div className="flex items-start gap-3 py-3">
                  <span className="text-gold font-semibold text-sm mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-gray-600">{type}</p>
                </div>
                {index < workflowTypes.length - 1 && <Separator />}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Included / Excluded */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-16">
              Sprint Scope
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FadeIn delay={0.1}>
              <div>
                <h3 className="font-semibold text-charcoal mb-6 text-lg">
                  ✅ Included
                </h3>
                <ul className="space-y-3">
                  {included.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-green-600 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <h3 className="font-semibold text-charcoal mb-6 text-lg">
                  ✗ Not Included
                </h3>
                <ul className="space-y-3">
                  {excluded.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <span className="text-gray-300 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Target Outcomes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-16">
              Target Outcomes
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {outcomes.map((outcome, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div>
                  <div className="text-2xl font-semibold text-charcoal mb-2">
                    {outcome.metric}
                  </div>
                  <div className="text-sm text-gray-500">
                    {outcome.description}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium mb-4">
              Ready to fix one workflow?
            </h2>
            <p className="text-gray-300 mb-10">
              30 minutes. No pitch deck. Let's see if the fit is there.
            </p>
            <a
              href={discoveryCallHref("sprint-page")}
              className="inline-flex items-center px-10 py-5 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors text-lg"
            >
              Schedule a Discovery Call
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sprint;
