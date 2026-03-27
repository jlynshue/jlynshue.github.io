import { Card, CardContent } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { Settings, Cpu, Code } from "lucide-react";

const services = [
  {
    icon: Settings,
    title: "Fractional CIO / IT Strategy",
    description:
      "Bring senior technical leadership to your team without the full-time overhead. Engineering governance, workflow architecture, BI strategy, vendor evaluation, and team scaling for startups and growth-stage companies.",
    outcomes: ["Governance frameworks", "Roadmap clarity", "Team velocity"],
  },
  {
    icon: Cpu,
    title: "AI & Edge Computing",
    description:
      "Computer vision pipelines, NVIDIA Jetson deployment, private LTE (CBRS) infrastructure, and real-time inference systems with sub-300ms latency.",
    outcomes: ["Sub-300ms latency", "Edge-first architecture", "99.9% uptime"],
  },
  {
    icon: Code,
    title: "Product Engineering",
    description:
      "Production-grade dashboards, data pipelines, API architecture, and CI/CD automation. From prototype to scale.",
    outcomes: ["Full-stack builds", "Data pipelines", "Cloud infrastructure"],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-charcoal mb-4 text-center">
            Services
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto text-lg">
            Strategy and execution across the full stack — from boardroom to deployment.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.1}>
              <Card className="border-t-4 border-t-gold border-x-0 border-b-0 rounded-none bg-white shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-8">
                  <service.icon className="w-8 h-8 text-gold mb-6" strokeWidth={1.5} />
                  <h3 className="font-serif text-xl font-semibold text-charcoal mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.outcomes.map((outcome) => (
                      <span
                        key={outcome}
                        className="text-xs font-medium text-gold-dark bg-gold/10 px-3 py-1 rounded-full"
                      >
                        {outcome}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
