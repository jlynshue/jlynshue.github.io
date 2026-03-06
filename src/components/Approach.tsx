import FadeIn from "@/components/FadeIn";
import { Search, Lightbulb, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery",
    description: "Understand your business, technical landscape, team capabilities, and constraints.",
  },
  {
    icon: Lightbulb,
    title: "Strategy",
    description: "Define architecture, roadmap, and success metrics aligned with business outcomes.",
  },
  {
    icon: Rocket,
    title: "Execution",
    description: "Build, test, and ship with clear milestones, sprint cadence, and continuous feedback.",
  },
  {
    icon: ArrowRight,
    title: "Handoff",
    description: "Transfer knowledge, document systems, and ensure your team can own it going forward.",
  },
];

const Approach = () => {
  return (
    <section id="approach" className="py-24 bg-charcoal text-white">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-5xl font-medium mb-4 text-center">
            How I Work
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto text-lg">
            Every engagement follows a structured process — from understanding the problem to handing off a running system.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.1}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
                </div>
                <div className="text-gold text-sm font-medium mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
