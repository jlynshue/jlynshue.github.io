import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EngagementCard from "@/components/EngagementCard";
import FadeIn from "@/components/FadeIn";
import type { EngagementTier } from "@/types/engagement";
import { discoveryCallHref, handleCTAClick } from "@/lib/tracking";

const engagementTiers: EngagementTier[] = [
  {
    id: "fractional-cio-cto",
    title: "Fractional CIO/CTO",
    subtitle: "Embedded technology leadership",
    priceRange: "$15K–$25K/mo",
    duration: "6–12 month engagement",
    description:
      "I embed 2-3 days per week with your team and own technology strategy, data architecture, AI roadmap, vendor management, and team hiring. Not advising — operating.",
    deliverables: [
      "Technology roadmap and architecture ownership",
      "Data infrastructure and governance",
      "AI/ML strategy and production deployment",
      "Vendor evaluation, selection, and management",
      "Engineering team hiring and leadership",
      "Board-ready technology communication",
      "Weekly executive sync + async availability",
    ],
    idealFor:
      "Growth-stage companies ($10M–$100M) that need a technology executive but can't justify a $400K+ full-time hire.",
    cta: "Schedule a Discovery Call",
    ctaLink: "/r/discovery-call?placement=how-i-work-fractional",
    highlighted: true,
  },
  {
    id: "workflow-sprint",
    title: "Executive Workflow Sprint",
    subtitle: "Fix one bottleneck in 10 days",
    priceRange: "$12K",
    duration: "10 business days",
    description:
      "One painful recurring workflow — reporting assembly, decision coordination, or action item tracking — diagnosed, designed, and built inside your existing stack.",
    deliverables: [
      "Workflow diagnostic and opportunity map",
      "Custom automation built in your tools (M365, Jira, Slack)",
      "Source-linked, trust-verified AI outputs",
      "Team training and handoff documentation",
      "30-day support window post-delivery",
    ],
    idealFor:
      "Ops-heavy teams with a specific reporting or coordination bottleneck costing 5-10+ hours per week.",
    cta: "Learn About The Sprint",
    ctaLink: "/sprint",
    highlighted: false,
  },
  {
    id: "tech-due-diligence",
    title: "Technology Due Diligence",
    subtitle: "PE/VC pre-investment assessment",
    priceRange: "$5K–$15K",
    duration: "1–2 weeks",
    description:
      "Deep-dive assessment of a target company's technology stack, team capability, data maturity, and AI readiness — delivered as a written report with risk matrix.",
    deliverables: [
      "Architecture risk assessment (scalability, security, tech debt)",
      "Team capability evaluation",
      "Data maturity scoring",
      "AI readiness assessment",
      "90-day recommendation roadmap",
      "Executive summary for investment committee",
    ],
    idealFor:
      "PE/VC firms evaluating technology-dependent acquisitions or investments.",
    cta: "Discuss Your Deal",
    ctaLink: "/r/discovery-call?placement=how-i-work-diligence",
    highlighted: false,
  },
  {
    id: "advisory-board",
    title: "Advisory Board",
    subtitle: "Quarterly strategic guidance",
    priceRange: "$2K–$5K/mo",
    duration: "Ongoing",
    description:
      "Strategic technology guidance without operational involvement. Monthly or quarterly check-ins, available for ad-hoc questions, and board meeting preparation support.",
    deliverables: [
      "Monthly strategic advisory session (60-90 min)",
      "Async access for critical technology decisions",
      "Board meeting preparation and technology narrative",
      "Vendor and hire review (as needed)",
      "Quarterly roadmap review",
    ],
    idealFor:
      "Companies with competent engineering teams that need periodic strategic oversight from a senior technology leader.",
    cta: "Explore Advisory",
    ctaLink: "/r/discovery-call?placement=how-i-work-advisory",
    highlighted: false,
  },
];

const HowIWork = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-charcoal leading-[1.1] tracking-tight mb-6">
              How I Work
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
              Enterprise technology leadership, structured for growth-stage
              budgets. Choose the engagement model that fits your needs.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Engagement Tiers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {engagementTiers.map((tier, index) => (
              <EngagementCard
                key={tier.id}
                tier={tier}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How Engagements Start */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal text-center mb-16">
              How Engagements Start
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 text-gold font-semibold flex items-center justify-center mx-auto mb-4 text-lg">
                  1
                </div>
                <h3 className="font-semibold text-charcoal mb-2">
                  Discovery Call
                </h3>
                <p className="text-sm text-gray-500">
                  20-minute conversation to understand your situation, pain
                  points, and whether there's a fit.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 text-gold font-semibold flex items-center justify-center mx-auto mb-4 text-lg">
                  2
                </div>
                <h3 className="font-semibold text-charcoal mb-2">
                  Scope & Proposal
                </h3>
                <p className="text-sm text-gray-500">
                  I'll send a clear proposal with scope, timeline, deliverables,
                  and pricing — no ambiguity.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 text-gold font-semibold flex items-center justify-center mx-auto mb-4 text-lg">
                  3
                </div>
                <h3 className="font-semibold text-charcoal mb-2">
                  Start in 2 Weeks
                </h3>
                <p className="text-sm text-gray-500">
                  Once agreed, I'm embedded with your team within 2 weeks.
                  Productive from day one.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal mb-6">
              Ready to talk?
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              I currently have capacity for 1-2 new engagements. Let's see if
              there's a fit.
            </p>
            <a
              href={discoveryCallHref("how-i-work-bottom")}
              onClick={handleCTAClick("discovery_call", "how-i-work-bottom")}
              className="inline-flex items-center px-8 py-4 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-colors text-lg"
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

export default HowIWork;
