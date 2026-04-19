import FadeIn from "@/components/FadeIn";

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "A 30-minute conversation to qualify the pain. Is the workflow narrow, recurring, and tied to real operating costs?",
    detail: "Free",
  },
  {
    number: "02",
    title: "Workflow Diagnostic",
    description:
      "Map the workflow, quantify waste, identify system boundaries, and define success criteria.",
    detail: "$2,500 · 3 days",
  },
  {
    number: "03",
    title: "Executive Workflow Sprint",
    description:
      "Implement one workflow end to end — integrate systems, build the output layer, validate quality, and hand off.",
    detail: "$12,000 · 10 days",
  },
  {
    number: "04",
    title: "Workflow Tuning Retainer",
    description:
      "Stabilize, expand, and monitor. One incremental improvement per month plus adoption support.",
    detail: "$3,500/mo · Ongoing",
  },
];

const Approach = () => {
  return (
    <section id="approach" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal text-center mb-4">
            From Workflow Friction To Working System
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            A clear path from diagnosis to implementation — no ambiguous roadmaps.
          </p>
        </FadeIn>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-gold font-semibold text-sm">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="font-semibold text-charcoal text-lg">
                      {step.title}
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">
                      {step.detail}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-6 border-l-2 border-gray-100 h-4" />
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
