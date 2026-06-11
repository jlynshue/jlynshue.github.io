import { useState } from "react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { discoveryCallHref, handleCTAClick } from "@/lib/tracking";
import BrandTopbar from "@/components/BrandTopbar";
import BrandFooter from "@/components/BrandFooter";
import SearchOverlay from "@/components/SearchOverlay";
import "./Redesign.css";
import "./About.css";

const About = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const variant = useFeatureFlag<"hybrid" | "services-led">("about-layout", "hybrid");

  /* ─── A. Anchor Case Teaser ─── */
  const caseTeaser = (
    <section className="section dark" key="case">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-num">00 / Proof</div>
          <div>
            <h2 className="sec-title">
              Numbers, not <em>adjectives.</em>
              <span className="dash">&mdash;</span>
            </h2>
          </div>
        </div>

        <div className="about-case-grid">
          <div className="about-case-narrative">
            <span className="pill signal">
              <span className="dot" />
              Case 01 &middot; Fractional CIO
            </span>
            <h3>From 14 spreadsheets to one decision surface.</h3>
            <p>
              A mid-market logistics company was running strategic decisions
              through fourteen disconnected spreadsheets. In 90 days, we
              consolidated reporting into a single governed surface &mdash;
              recovering 120+ executive hours per month and unblocking a
              capital-allocation decision that had stalled for two quarters.
            </p>
            <a href="/work" className="btn signal">
              Read the case study <span className="arr">&rarr;</span>
            </a>
          </div>

          <div className="about-stat-grid">
            <div className="about-stat-cell">
              <div className="about-stat-value">90d</div>
              <div className="about-stat-label">Time to value</div>
            </div>
            <div className="about-stat-cell">
              <div className="about-stat-value">14&rarr;1</div>
              <div className="about-stat-label">Decision surfaces</div>
            </div>
            <div className="about-stat-cell">
              <div className="about-stat-value">3.1&times;</div>
              <div className="about-stat-label">Reporting velocity</div>
            </div>
            <div className="about-stat-cell">
              <div className="about-stat-value">$1.8M</div>
              <div className="about-stat-label">Capital unblocked</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── B. Service Pillars ─── */
  const servicePillars = (
    <section className="section" key="services">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-num">01 / Services</div>
          <div>
            <h2 className="sec-title">
              Three ways of <em>working.</em>
            </h2>
            <p className="sec-lede">
              Each one ends with something you can measure.
            </p>
          </div>
        </div>

        <div className="vp-grid">
          <div className="vp">
            <div className="n">No 01 &mdash; Fractional CIO/CTO</div>
            <h4>
              The function, before the <em>headcount.</em>
            </h4>
            <p>
              Embedded executive leadership for mid-market companies: roadmap,
              vendor posture, hiring plan, and a data estate someone can
              actually be accountable for.
            </p>
            <div className="vp-meta">90-day engagements &middot; 2-3 days/week</div>
          </div>

          <div className="vp">
            <div className="n">No 02 &mdash; Data &amp; AI Strategy</div>
            <h4>
              Numbers as evidence, <em>not adjectives.</em>
            </h4>
            <p>
              Strategy engagements that end in shipped infrastructure &mdash;
              not a deck. Build-vs-buy calls, platform selection, and the
              governance to keep it honest.
            </p>
            <div className="vp-meta">4-8 week sprints</div>
          </div>

          <div className="vp">
            <div className="n">No 03 &mdash; Anuba Technologies</div>
            <h4>
              Building the <em>product side.</em>
            </h4>
            <p>
              Co-founder and CIO. Anuba is where the consulting patterns become
              software &mdash; the proving ground for everything the practice
              recommends.
            </p>
            <div className="vp-meta">anubatechnologies.com</div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── C. Personal Narrative ─── */
  const personalNarrative = (
    <section className="section" key="bio">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-num">02 / Background</div>
          <div>
            <h2 className="sec-title">
              The operator&rsquo;s <em>arc.</em>
            </h2>
          </div>
        </div>

        <div className="strat-grid">
          <div>
            <p className="pull">
              <em>
                Enterprise rigor at startup velocity.
                <span className="dash">&mdash;</span>
              </em>
            </p>
          </div>

          <div>
            <div className="strat-block">
              <h3>Experience</h3>
              <p>
                Twenty years inside enterprise complexity &mdash;
                Razorfish/Publicis serving Stellantis, Marriott, Samsung,
                Bridgestone, Southern Glazer&rsquo;s. Today: CIO of a
                venture-backed startup.
              </p>
            </div>

            <div className="strat-block">
              <h3>Outcomes</h3>
              <p>
                Architected analytics that scaled a B2B platform from $100M to
                $1.4B+ in 18 months (Southern Glazer&rsquo;s). Two provisional
                patents at Anuba. A track record of shipping infrastructure,
                not decks.
              </p>
            </div>

            <div className="strat-block">
              <h3>Operating philosophy</h3>
              <p>
                Numbers are evidence, not adjectives. Build-vs-buy is usually a
                staffing question. A fractional executive should leave well
                &mdash; with runbooks, a hiring plan, and a system someone else
                can be accountable for.
              </p>
            </div>

            <div className="strat-block">
              <h3>Location</h3>
              <p>
                Miami, FL. Remote-first practice; on-site where the work
                requires it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── D. Engagement Process ─── */
  const engagementProcess = (
    <section className="section" key="process">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-num">03 / Process</div>
          <div>
            <h2 className="sec-title">
              Discovery to <em>handover.</em>
            </h2>
          </div>
        </div>

        <div className="about-process-grid">
          <div className="about-process-step">
            <div className="about-process-num">01</div>
            <h4>Discovery</h4>
            <p>
              A 30-minute call to scope the question. No pitch deck &mdash;
              just the one workflow costing the most executive hours.
            </p>
            <div className="about-process-time">Day 0</div>
          </div>

          <div className="about-process-step">
            <div className="about-process-num">02</div>
            <h4>Diagnostic</h4>
            <p>
              Two weeks on the floor. Every workaround logged, every system
              inventoried. One governing metric identified.
            </p>
            <div className="about-process-time">Weeks 1-2</div>
          </div>

          <div className="about-process-step">
            <div className="about-process-num">03</div>
            <h4>Sprint</h4>
            <p>
              Build the spine, ship the surface. Ugly on day 45, iterated
              weekly with the desk. Adoption before polish.
            </p>
            <div className="about-process-time">Weeks 3-10</div>
          </div>

          <div className="about-process-step">
            <div className="about-process-num">04</div>
            <h4>Handover</h4>
            <p>
              Hiring plan, runbooks, and a data engineer recruited and
              onboarded. The point of fractional is leaving well.
            </p>
            <div className="about-process-time">Weeks 11-12</div>
          </div>
        </div>

        <div className="about-availability">
          <span className="pill signal">
            <span className="dot" />
            Available &middot; Q3 2026
          </span>
          <p>
            One engagement slot open per quarter. Book a discovery call to
            discuss timing and fit.
          </p>
        </div>
      </div>
    </section>
  );

  /* ─── E. CTA Section ─── */
  const ctaSection = (
    <section className="section dark" key="cta">
      <div className="wrap" style={{ textAlign: "center", maxWidth: 720 }}>
        <div style={{ marginBottom: "var(--s-6)" }}>
          <span className="pill signal">
            <span className="dot" />
            Available &middot; Q3 2026
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: "clamp(40px, 5vw, 72px)",
            lineHeight: 0.95,
            letterSpacing: "-.01em",
            margin: "0 0 var(--s-5)",
          }}
        >
          Let&rsquo;s find the <em>signal.</em>
          <span style={{ color: "var(--signal)" }}>&mdash;</span>
        </h2>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 18,
            color: "var(--mist)",
            lineHeight: 1.5,
            maxWidth: "50ch",
            margin: "0 auto var(--s-7)",
          }}
        >
          Book a 30-minute diagnostic call. No pitch deck &mdash; just the one
          workflow that&rsquo;s costing you the most executive hours per month.
        </p>
        <a
          href={discoveryCallHref("about-cta")}
          onClick={handleCTAClick("discovery_call", "about-cta")}
          className="btn signal"
          style={{ fontSize: 16, padding: "14px 28px" }}
        >
          Book a discovery call <span className="arr">&rarr;</span>
        </a>
      </div>
    </section>
  );

  /* ─── Variant ordering ─── */
  const sections =
    variant === "services-led"
      ? [servicePillars, caseTeaser, personalNarrative, engagementProcess, ctaSection]
      : [caseTeaser, servicePillars, personalNarrative, engagementProcess, ctaSection];

  return (
    <div className="brand wp">
      <BrandTopbar
        activePage="about"
        onSearchOpen={() => setSearchOpen(true)}
      />
      {sections}
      <BrandFooter />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default About;
