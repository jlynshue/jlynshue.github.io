import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { Separator } from "@/components/ui/separator";
import { discoveryCallHref } from "@/lib/tracking";

const diagnosticDays = [
  {
    day: "Day 1",
    title: "Discovery & Inventory",
    items: [
      "Stakeholder interviews",
      "Artifact and document review",
      "Source system inventory",
    ],
  },
  {
    day: "Day 2",
    title: "Analysis & Mapping",
    items: [
      "Current-state workflow map",
      "Bottleneck identification and waste analysis",
      "Trust and risk review",
    ],
  },
  {
    day: "Day 3",
    title: "Recommendation & Decision",
    items: [
      "Recommended target workflow design",
      "Scope and success criteria definition",
      "Go/no-go decision for sprint",
    ],
  },
];

const deliverables = [
  "Workflow map of the current state",
  "Current-state bottleneck analysis",
  "Source systems inventory and boundary map",
  "Trust and risk assessment",
  "Target workflow design",
  "Implementation recommendation with scope and success criteria",
];

const Diagnostic = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal leading-tight mb-6">
              Workflow Diagnostic
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-500 mb-8">
              Map one workflow. Quantify the waste. Define the fix.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="inline-flex items-baseline gap-2 text-charcoal mb-4">
              <span className="text-3xl font-semibold">$2,500</span>
              <span className="text-gray-400">· 3 business days</span>
            </div>
            <p className="text-sm text-gold font-medium">
              Fully credited toward the sprint if you proceed within 7 days.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-8">
              What The Diagnostic Covers
            </h2>
            <p className="text-gray-500 text-center mb-4 leading-relaxed">
              The diagnostic is not a teaser. It is a paid decision tool.
            </p>
            <p className="text-gray-500 text-center leading-relaxed">
              In 3 business days, you get a complete picture of one recurring
              workflow: where it breaks, what it costs, and exactly how to fix
              it. Whether or not you proceed to a sprint, the diagnostic
              delivers standalone value.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3-Day Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-16">
              3-Day Timeline
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {diagnosticDays.map((phase, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 h-full">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {phase.day}
                  </span>
                  <h3 className="font-semibold text-charcoal text-lg mt-2 mb-4">
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-12">
              What You Receive
            </h2>
          </FadeIn>

          <div className="bg-white rounded-xl border border-gray-100 p-8">
            {deliverables.map((item, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <div className="flex items-start gap-3 py-3">
                  <span className="text-gold mt-0.5">✓</span>
                  <p className="text-gray-600">{item}</p>
                </div>
                {index < deliverables.length - 1 && <Separator />}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Note */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="bg-gold/5 rounded-xl border border-gold/20 p-8">
              <h3 className="font-serif text-xl font-medium text-charcoal mb-3">
                Diagnostic fee credited toward the sprint
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                If you move forward to the Executive Workflow Sprint within 7
                days of receiving the diagnostic, the full $2,500 is credited
                toward the $12,000 sprint investment.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-3xl font-medium mb-4">
              Start with the diagnostic.
            </h2>
            <p className="text-gray-300 mb-10">
              30 minutes. No pitch deck. Let's see if the fit is there.
            </p>
            <a
              href={discoveryCallHref("diagnostic-page")}
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

export default Diagnostic;
