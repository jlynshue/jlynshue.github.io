import { useEffect, useRef } from "react";
import { initWallpaper } from "./wallpaper";
import { discoveryCallHref, handleCTAClick } from "@/lib/tracking";
import ProjectsSection from "@/components/ProjectsSection";
import "./Redesign.css";

const Redesign = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initWallpaper(canvas);
  }, []);

  return (
  <div className="brand wp">
    <canvas ref={canvasRef} className="wp-bg" />
    {/* TOPBAR */}
    <div className="topbar">
      <div className="topbar-inner">
        <div className="top-mark">
          JL<span className="dash">—</span>S
        </div>
        <nav className="top-nav">
          <a href="#strategy">Strategy</a>
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href="#approach">Approach</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          href={discoveryCallHref("redesign-topbar")}
          onClick={handleCTAClick("discovery_call", "redesign-topbar")}
          className="btn signal"
          style={{ padding: "8px 14px", fontSize: 12 }}
        >
          Book a sprint <span className="arr">→</span>
        </a>
      </div>
    </div>

    {/* HERO */}
    <header className="hero">
      <div className="wrap">
        <div className="hero-eyebrow">
          <span className="dot" />
          <span className="eyebrow">Data &amp; AI Executive</span>
          <span className="eyebrow" style={{ color: "var(--ink)" }}>·</span>
          <span className="eyebrow">Fractional CIO/CTO</span>
          <span className="eyebrow" style={{ color: "var(--ink)" }}>·</span>
          <span className="eyebrow">Miami, FL</span>
        </div>
        <div className="hero-grid">
          <div>
            <h1>
              The space
              <br />
              between
              <br />
              <em>signal</em> <span className="dash">—</span>and
              <br />
              structure.
            </h1>
            <p className="hero-sub">
              I build AI workflow systems that remove executive reporting and
              coordination bottlenecks for CIO and ops-led teams. One workflow.
              Ten business days.
            </p>
            <div className="hero-meta">
              <div className="meta-item">
                <div className="k">Role</div>
                <div className="v">CIO &amp; Co-Founder</div>
              </div>
              <div className="meta-item">
                <div className="k">Practice</div>
                <div className="v">Fractional CIO/CTO</div>
              </div>
              <div className="meta-item">
                <div className="k">Based</div>
                <div className="v">Miami, FL</div>
              </div>
              <div className="meta-item">
                <div className="k">Available</div>
                <div className="v">Q3 2026</div>
              </div>
            </div>
          </div>
          <figure className="hero-portrait">
            <span className="badge">Jonathan Lyn-Shue</span>
            <img
              src="/jonathan-headshot.png"
              alt="Jonathan Lyn-Shue, Data & AI executive, looking into camera"
            />
            <span className="corner">
              JL<span style={{ color: "var(--signal)" }}>—</span>S · 2026
            </span>
          </figure>
        </div>
      </div>
    </header>

    {/* STRATEGY */}
    <section className="section" id="strategy">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-num">00 / Strategy</div>
          <div>
            <h2 className="sec-title">
              A practice, not a <em>résumé</em>.
            </h2>
            <p className="sec-lede">
              The strategy brief is a one-page operating system for every brand
              decision that follows. When in doubt, read this first.
            </p>
          </div>
        </div>

        <div className="strat-grid">
          <div>
            <p className="pull">
              <em>
                "I turn enterprise complexity into{" "}
                <span className="dash">—</span>measurable revenue, faster than
                your org chart says is possible."
              </em>
            </p>
            <p className="pull-attrib">Brand positioning · one-line</p>

            <div className="pitch-card">
              <div className="label">Elevator pitch · 30 seconds</div>
              <p>
                I'm a Data &amp; AI executive with 15+ years inside Fortune 500
                transformations{" "}
                <span className="dash">—</span> Stellantis, Marriott, Samsung,
                Bridgestone, Southern Glazer's. Today I run a fractional CIO/CTO
                practice and co-founded an edge-AI startup with two provisional
                patents. I help operationally complex companies turn analytics
                infrastructure into eight-figure outcomes.{" "}
                <em>One workflow. Ten business days.</em>
              </p>
            </div>
          </div>

          <div>
            <div className="strat-block">
              <h3>Audience · who this speaks to</h3>
              <p>Three concentric circles, in priority order.</p>
              <ul>
                <li>
                  <strong>CIO/COO &amp; ops-led teams</strong> at 50–2,000 person
                  companies feeling executive-reporting friction.
                </li>
                <li>
                  <strong>Growth-stage founders</strong> who need a fractional
                  senior operator without a full-time hire.
                </li>
                <li>
                  <strong>Fortune 500 stakeholders</strong> evaluating outside
                  consulting on data, AI, and analytics architecture.
                </li>
              </ul>
            </div>

            <div className="strat-block">
              <h3>Promise</h3>
              <p>
                A senior operator's judgment, applied in fixed-scope diagnostic
                sprints that recover 120+ executive hours per month and unblock
                decisions that have stalled for quarters.
              </p>
            </div>

            <div className="strat-block">
              <h3>Differentiators</h3>
              <ul>
                <li>
                  11 years embedded with Fortune 500 C-suite, currently shipping
                  inside a startup.
                </li>
                <li>
                  Architected analytics that scaled $100M → $1.4B+ in 18 months
                  (Southern Glazer's).
                </li>
                <li>
                  Bilingual fluency between board-level strategy and
                  re-architecting core components on a live call.
                </li>
              </ul>
            </div>

            <div className="strat-block">
              <h3>Brand archetype</h3>
              <p>
                The <em>Operator</em> crossed with the <em>Translator</em>.
                Confident, dry, structurally clear. Never breathless, never
                inflated, never AI-buzzword soup.
              </p>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="vp-grid">
          <div className="vp">
            <div className="n">Value prop 01</div>
            <h4>
              Enterprise rigor <em>at startup velocity.</em>
            </h4>
            <p>
              Eleven years inside Razorfish/Publicis serving Fortune 500.
              Co-founder execution speed. Every engagement gets both.
            </p>
          </div>
          <div className="vp">
            <div className="n">Value prop 02</div>
            <h4>
              Fixed scope. <em>Fixed clock.</em>
            </h4>
            <p>
              Six-week diagnostic sprints. One workflow. Ten business days.
              Outcomes measured in dollars, hours recovered, decisions unblocked.
            </p>
          </div>
          <div className="vp">
            <div className="n">Value prop 03</div>
            <h4>
              Architecture, <em>not advice.</em>
            </h4>
            <p>
              If it can't be rebuilt on a live call, it isn't a recommendation.
              Stack-level depth across cloud, data, AI, and edge inference.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* WORK / CASE STUDIES */}
    <section className="section dark" id="work">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-num">01 / Work</div>
          <div>
            <h2 className="sec-title">
              Numbers, <em>not adjectives.</em>
            </h2>
            <p className="sec-lede" style={{ color: "var(--mist)" }}>
              Select outcomes from enterprise and startup engagements. Every
              metric is verifiable.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--s-5)",
          }}
        >
          <div className="card">
            <div className="ck">Case study · 01</div>
            <h4>Southern Glazer's, 14× in 18 months.</h4>
            <p>
              Engineered analytics data pipeline (GA360, CM360, BigQuery)
              enabling B2B e-commerce platform growth from $100M to $1.4B+.
            </p>
            <div className="ck-foot">
              <span>2020 — 2022</span>
              <a href="https://linkedin.com/in/jonathanlynshue" target="_blank" rel="noopener noreferrer">Read →</a>
            </div>
          </div>
          <div className="card">
            <div className="ck">Case study · 02</div>
            <h4>Anuba Technologies, $22.5M error-cost reduction.</h4>
            <p>
              Edge-AI computer vision system for QSR. Two provisional patents.
              NVIDIA Inception. Pilot phase 2 of 4.
            </p>
            <div className="ck-foot">
              <span>2024 — present</span>
              <a href="https://linkedin.com/in/jonathanlynshue" target="_blank" rel="noopener noreferrer">Read →</a>
            </div>
          </div>
          <div className="card">
            <div className="ck">Case study · 03</div>
            <h4>Stellantis, global data governance at scale.</h4>
            <p>
              Led global analytics strategy across 14 brands. Unified reporting
              infrastructure for 250+ stakeholders.
            </p>
            <div className="ck-foot">
              <span>2022 — 2024</span>
              <a href="https://linkedin.com/in/jonathanlynshue" target="_blank" rel="noopener noreferrer">Read →</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* PROJECTS */}
    <ProjectsSection />

    {/* APPROACH */}
    <section className="section" id="approach">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-num">03 / Approach</div>
          <div>
            <h2 className="sec-title">
              One workflow. <em>Ten business days.</em>
            </h2>
            <p className="sec-lede">
              Every engagement follows a diagnostic sprint structure. Week one:
              map. Week two: instrument. Week three: architect. Week four:
              validate. Weeks five and six: implement the highest-leverage
              change.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--s-5)",
          }}
        >
          {[
            {
              week: "Week 1–2",
              title: "Map & Instrument",
              desc: "Identify the single highest-leverage workflow. Instrument it so we can measure before and after.",
            },
            {
              week: "Week 3–4",
              title: "Architect & Validate",
              desc: "Propose an architecture change measurable against a single P&L line. Validate with stakeholders.",
            },
            {
              week: "Week 5–6",
              title: "Implement & Measure",
              desc: "Ship the change. Measure the delta. Hand off a repeatable system, not a slide deck.",
            },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                padding: "var(--s-6)",
                borderTop: "2px solid var(--signal)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: ".14em",
                  textTransform: "uppercase" as const,
                  color: "var(--signal)",
                  marginBottom: "var(--s-3)",
                }}
              >
                {step.week}
              </div>
              <h4
                style={{
                  fontFamily: "var(--serif)",
                  fontWeight: 400,
                  fontSize: 26,
                  lineHeight: 1.1,
                  margin: "0 0 var(--s-3)",
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  color: "var(--steel)",
                  lineHeight: 1.55,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA / CONTACT */}
    <section className="section dark" id="contact">
      <div className="wrap" style={{ textAlign: "center" as const, maxWidth: 720 }}>
        <div style={{ marginBottom: "var(--s-6)" }}>
          <span className="pill signal" style={{ borderColor: "var(--signal)", color: "var(--signal)" }}>
            <span className="dot" />
            Available · Q3 2026
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
          Let's build the{" "}
          <em style={{ fontStyle: "italic" }}>workflow.</em>
          <span style={{ color: "var(--signal)" }}>—</span>
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
          Book a 30-minute diagnostic call. No pitch deck — just the one
          workflow that's costing you the most executive hours per month.
        </p>
        <a
          href={discoveryCallHref("redesign-contact")}
          onClick={handleCTAClick("discovery_call", "redesign-contact")}
          className="btn signal"
          style={{ fontSize: 16, padding: "14px 28px" }}
        >
          Book a discovery call <span className="arr">→</span>
        </a>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div
              className="eyebrow"
              style={{ color: "var(--mist)", marginBottom: "var(--s-4)" }}
            >
              JL—S Consulting
            </div>
            <h3>
              One workflow.
              <br />
              <em>Ten business days.</em>
              <span className="dash">—</span>
            </h3>
          </div>
          <div className="meta">
            <strong style={{ color: "var(--paper)" }}>
              Jonathan Lyn-Shue
            </strong>
            <br />
            CIO &amp; Co-Founder, Anuba Technologies
            <br />
            Fractional CIO/CTO · JL—S Consulting
            <br />
            Miami, FL · <a href="tel:+13054849168">305 · 484 · 9168</a>
            <br />
            <a href="mailto:jonathan.lynshue@gmail.com">jonathan.lynshue@gmail.com</a>
          </div>
          <div className="vers">
            jonathanlynshue.com
            <br />
            <a href="https://linkedin.com/in/jonathanlynshue" target="_blank" rel="noopener noreferrer">/in/jonathanlynshue</a>
            <br />
            <br />
            <span style={{ color: "var(--signal)" }}>●</span> available
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default Redesign;
