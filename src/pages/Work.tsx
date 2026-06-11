import { useState } from "react";
import "./Redesign.css";
import "./Work.css";
import BrandTopbar from "@/components/BrandTopbar";
import BrandFooter from "@/components/BrandFooter";
import SearchOverlay from "@/components/SearchOverlay";
import { useSectionTracking } from "@/hooks/useSectionTracking";

const WORK_SECTIONS = [
  { id: "case-head", title: "Case Header", index: 0 },
  { id: "stat-band", title: "Stat Band", index: 1 },
  { id: "context", title: "Context", index: 2 },
  { id: "approach", title: "Approach", index: 3 },
  { id: "results", title: "Results", index: 4 },
  { id: "cta", title: "CTA", index: 5 },
];

export default function Work() {
  const [searchOpen, setSearchOpen] = useState(false);
  useSectionTracking(WORK_SECTIONS);

  return (
    <div>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BrandTopbar
        variant="light"
        activePage="work"
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* ===== CASE HEADER ===== */}
      <header className="section case-head" data-section-id="case-head">
        <div className="wrap">
          <div className="case-head-eyebrow">
            <span className="pill">
              <span className="dot" />
              Case 01
            </span>
            <span className="eyebrow">
              Fractional CIO &middot; Mid-market logistics &middot; Anonymized
            </span>
          </div>

          <h1 className="case-title">
            From 14 spreadsheets to one decision
            surface.&mdash;
          </h1>

          <p className="case-lede">
            A mid-market freight operator running $380M in annual revenue across
            23 terminals, 1,400 drivers, and a margin stack held together by
            tribal knowledge, email threads, and a finance team that spent more
            time reconciling than deciding.
          </p>

          <div className="case-meta">
            <div className="meta-cell">
              <div className="k">Client</div>
              <div className="v">Regional freight operator, 23 terminals</div>
            </div>
            <div className="meta-cell">
              <div className="k">Role</div>
              <div className="v">Fractional CIO</div>
            </div>
            <div className="meta-cell">
              <div className="k">Duration</div>
              <div className="v">90 days, idea to production</div>
            </div>
            <div className="meta-cell">
              <div className="k">Team</div>
              <div className="v">1 architect + 2 analysts + 1 PM</div>
            </div>
            <div className="meta-cell">
              <div className="k">Year</div>
              <div className="v">2025</div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== STAT BAND ===== */}
      <section className="section dark stat-band" data-section-id="stat-band">
        <div className="wrap">
          <div className="stat-grid">
            <div className="stat-cell">
              <div className="stat-num">
                90<span className="stat-unit">d</span>
              </div>
              <div className="stat-label">Idea to production</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num">
                14<span className="stat-arrow">&rarr;</span>
                <span className="stat-highlight">1</span>
              </div>
              <div className="stat-label">Systems consolidated</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num">
                3.1<span className="stat-unit">&times;</span>
              </div>
              <div className="stat-label">Quote turnaround</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num">
                $1.8<span className="stat-unit">M</span>
              </div>
              <div className="stat-label">Margin recovered yr 1</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 01 / CONTEXT ===== */}
      <section className="section" id="context" data-section-id="context">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-num">01 / Context</div>
            <div>
              <h2 className="sec-title">
                The quarter closed before the question did.
              </h2>
            </div>
          </div>

          <div className="context-prose">
            <p>
              The company had grown 4&times; in six years through acquisition.
              Every terminal brought its own spreadsheet, its own margin
              definition, and its own idea of what &ldquo;on-time&rdquo; meant.
              By the time I arrived, the CFO&rsquo;s team was spending 11 hours
              per quote reconciling data across 14 sources before they could even
              begin pricing.
            </p>
            <p>
              The CEO asked a simple question every Monday: &ldquo;What is our
              gross margin this week?&rdquo; Three people gave three different
              answers. The quarter closed before anyone agreed on the number.
            </p>
          </div>

          {/* Before / After Ledger */}
          <div className="ledger">
            <div className="ledger-header">
              <div className="ledger-col ledger-before">
                Before &mdash; Q1 2025
              </div>
              <div className="ledger-col ledger-after">
                After &mdash; Q4 2025
              </div>
            </div>

            <div className="ledger-row">
              <div className="ledger-col">
                <h4>Quote turnaround</h4>
                <p>
                  11 hours average. Three analysts pulling from email, ERP
                  exports, and a shared drive folder named &ldquo;FINAL
                  v3.&rdquo;
                </p>
              </div>
              <div className="ledger-col">
                <h4>Quote turnaround</h4>
                <p>
                  3.5 hours. Single surface, pre-populated with live lane data
                  and margin thresholds from the spine.
                </p>
              </div>
            </div>

            <div className="ledger-row">
              <div className="ledger-col">
                <h4>Margin reconciliation</h4>
                <p>
                  9 business days from close to board-ready P&amp;L. Manual
                  journal entries for inter-terminal transfers.
                </p>
              </div>
              <div className="ledger-col">
                <h4>Margin reconciliation</h4>
                <p>
                  Half a day. Automated netting, one canonical gross-margin
                  definition, exceptions surfaced by rule.
                </p>
              </div>
            </div>

            <div className="ledger-row">
              <div className="ledger-col">
                <h4>Margin definitions</h4>
                <p>
                  Three competing definitions across finance, ops, and sales.
                  Board presentations footnoted with caveats.
                </p>
              </div>
              <div className="ledger-col">
                <h4>Margin definitions</h4>
                <p>
                  One. Governed by a metric contract with ownership, refresh
                  cadence, and exception routing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 02 / APPROACH ===== */}
      <section className="section" id="approach" data-section-id="approach">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-num">02 / Approach</div>
            <div>
              <h2 className="sec-title">
                Ninety days, five moves.
              </h2>
            </div>
          </div>

          {/* 5-Step Process */}
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Discovery &amp; audit</h4>
              <p>
                Map every data source, every handoff, every definition
                disagreement. Name the pain in dollars.
              </p>
              <div className="step-dur">Weeks 1&ndash;2</div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Metric contract</h4>
              <p>
                One canonical definition of gross margin. Ownership, refresh
                cadence, and exception escalation path.
              </p>
              <div className="step-dur">Week 3</div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Platform spine</h4>
              <p>
                A data integration layer that replaces the 14 spreadsheets with
                one governed pipeline.
              </p>
              <div className="step-dur">Weeks 4&ndash;8</div>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Pricing surface</h4>
              <p>
                A quote-builder that pulls live lane data, margin thresholds, and
                capacity signals into one screen.
              </p>
              <div className="step-dur">Weeks 7&ndash;10</div>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <h4>Handover &amp; governance</h4>
              <p>
                Runbooks, alerting, and a quarterly review cadence that keeps
                definitions from drifting.
              </p>
              <div className="step-dur">Weeks 11&ndash;12</div>
            </div>
          </div>

          {/* 12-Week Timeline */}
          <div className="timeline">
            <div className="timeline-scale">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="timeline-week">
                  W{i + 1}
                </div>
              ))}
            </div>
            <div className="timeline-bars">
              <div className="timeline-row">
                <div
                  className="timeline-bar bar-discovery"
                  style={{ gridColumn: "1 / 3" }}
                >
                  Discovery
                </div>
              </div>
              <div className="timeline-row">
                <div
                  className="timeline-bar bar-metric"
                  style={{ gridColumn: "3 / 4" }}
                >
                  Metric contract
                </div>
              </div>
              <div className="timeline-row">
                <div
                  className="timeline-bar bar-spine"
                  style={{ gridColumn: "4 / 9" }}
                >
                  Platform spine
                </div>
              </div>
              <div className="timeline-row">
                <div
                  className="timeline-bar bar-surface"
                  style={{ gridColumn: "7 / 11" }}
                >
                  Pricing surface
                </div>
              </div>
              <div className="timeline-row">
                <div
                  className="timeline-bar bar-handover"
                  style={{ gridColumn: "11 / 13" }}
                >
                  Handover
                </div>
              </div>
            </div>
            <div className="timeline-notes">
              <div className="timeline-note" style={{ gridColumn: "3 / 4" }}>
                <span className="note-marker" />
                Metric contract signed
              </div>
              <div className="timeline-note" style={{ gridColumn: "8 / 9" }}>
                <span className="note-marker" />
                Spine live
              </div>
              <div className="timeline-note" style={{ gridColumn: "12 / 13" }}>
                <span className="note-marker" />
                Production
              </div>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="arch">
            <div className="arch-col">
              <div className="arch-label">Sources (14)</div>
              <div className="arch-node legacy">ERP exports</div>
              <div className="arch-node legacy">Shared drives</div>
              <div className="arch-node legacy">Email attachments</div>
              <div className="arch-node legacy">TMS feeds</div>
              <div className="arch-node legacy">Manual journals</div>
            </div>
            <div className="arch-arrow">&rarr;</div>
            <div className="arch-col">
              <div className="arch-label">Spine</div>
              <div className="arch-node hot">Integration layer</div>
              <div className="arch-node hot">Metric contract</div>
              <div className="arch-node hot">Governance rules</div>
            </div>
            <div className="arch-arrow">&rarr;</div>
            <div className="arch-col">
              <div className="arch-label">Surfaces</div>
              <div className="arch-node hot">Quote builder</div>
              <div className="arch-node hot">Margin dashboard</div>
              <div className="arch-node">Alert engine</div>
            </div>
            <div className="arch-arrow">&rarr;</div>
            <div className="arch-col">
              <div className="arch-label">Decisions</div>
              <div className="arch-node">Lane pricing</div>
              <div className="arch-node">Capacity allocation</div>
              <div className="arch-node">Board reporting</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 03 / RESULTS ===== */}
      <section className="section" id="results" data-section-id="results">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-num">03 / Results</div>
            <div>
              <h2 className="sec-title">
                With the numbers attached.
              </h2>
            </div>
          </div>

          {/* Metric Delta Bars */}
          <div className="deltas">
            <div className="delta-row">
              <div className="delta-label">Quote turnaround</div>
              <div className="delta-bars">
                <div className="delta-before" style={{ width: "100%" }}>
                  <span className="delta-val">11.0h</span>
                </div>
                <div className="delta-after" style={{ width: "31.8%" }}>
                  <span className="delta-val">3.5h</span>
                </div>
              </div>
            </div>
            <div className="delta-row">
              <div className="delta-label">Margin reconciliation</div>
              <div className="delta-bars">
                <div className="delta-before" style={{ width: "100%" }}>
                  <span className="delta-val">9.0d</span>
                </div>
                <div className="delta-after" style={{ width: "5.6%" }}>
                  <span className="delta-val">0.5d</span>
                </div>
              </div>
            </div>
            <div className="delta-row">
              <div className="delta-label">Analyst time on plumbing</div>
              <div className="delta-bars">
                <div className="delta-before" style={{ width: "100%" }}>
                  <span className="delta-val">60%</span>
                </div>
                <div className="delta-after" style={{ width: "20%" }}>
                  <span className="delta-val">12%</span>
                </div>
              </div>
            </div>
            <div className="delta-row">
              <div className="delta-label">Definitions of gross margin</div>
              <div className="delta-bars">
                <div className="delta-before" style={{ width: "100%" }}>
                  <span className="delta-val">3</span>
                </div>
                <div className="delta-after" style={{ width: "33.3%" }}>
                  <span className="delta-val">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pull Quote */}
          <blockquote className="case-quote">
            <p>
              &ldquo;We stopped arguing about whose number was right &mdash; and
              started arguing about what to do.&rdquo;
            </p>
            <cite>CFO, anonymized</cite>
          </blockquote>

          <p className="case-disclaimer">
            Figures are representative composites based on real engagements.
            Client identity anonymized per NDA. Specific metrics available upon
            request in a confidential context.
          </p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section dark" id="cta" data-section-id="cta">
        <div
          className="wrap"
          style={{ textAlign: "center", maxWidth: 720 }}
        >
          <h2
            className="sec-title"
            style={{ marginBottom: "var(--s-6)" }}
          >
            Have a margin question with three
            answers?<span style={{ color: "var(--signal)" }}>&mdash;</span>
          </h2>
          <a
            href="mailto:jonathan.lynshue@gmail.com?subject=Margin%20question%20with%20three%20answers"
            className="btn signal"
            style={{ fontSize: 16, padding: "14px 28px" }}
          >
            Let&rsquo;s find the one that matters{" "}
            <span className="arr">&rarr;</span>
          </a>
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
