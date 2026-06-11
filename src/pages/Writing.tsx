import { useState } from "react";
import "./Redesign.css";
import "./Writing.css";
import BrandTopbar from "@/components/BrandTopbar";
import BrandFooter from "@/components/BrandFooter";
import SearchOverlay from "@/components/SearchOverlay";

const Writing = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="brand writing-page">
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BrandTopbar
        variant="light"
        activePage="writing"
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Post Header */}
      <header className="post-head">
        <div className="wrap">
          <div className="post-kicker">
            <span className="kicker-pill">Field Note &middot; 014</span>
            <span className="kicker-eyebrow">Data Strategy</span>
          </div>

          <h1 className="post-title">
            Numbers are not adjectives.<span className="dash">&mdash;</span>
          </h1>

          <p className="post-lede">
            On using data as evidence, not decoration&mdash;and why your
            dashboards might be the most expensive screensavers in the building.
          </p>

          <div className="post-byline">
            <div className="byline-item">
              <span className="byline-k">Author</span>
              <span className="byline-v">Jonathan Lyn-Shue</span>
            </div>
            <div className="byline-item">
              <span className="byline-k">Published</span>
              <span className="byline-v">Jun 02, 2026</span>
            </div>
            <div className="byline-item">
              <span className="byline-k">Reading</span>
              <span className="byline-v">6 min</span>
            </div>
            <div className="byline-item">
              <span className="byline-k">Filed under</span>
              <span className="byline-v">Data &middot; Operating</span>
            </div>
          </div>
        </div>
      </header>

      {/* Post Body */}
      <section className="post-body section">
        <div className="wrap">
          <div className="post-layout">
            {/* Left margin rail */}
            <aside className="margin-rail">
              <div className="margin-note">
                <strong>TL;DR</strong> &mdash; If removing a number from a slide
                changes no decision, the number was an adjective. Cut it.
              </div>
            </aside>

            {/* Prose column */}
            <article className="prose">
              <p>
                Every organization I walk into has the same disease: numbers used
                as adjectives. Revenue is &ldquo;strong.&rdquo; Churn is
                &ldquo;concerning.&rdquo; Pipeline is &ldquo;healthy.&rdquo; The
                numbers sit on slides like garnish on a plate&mdash;decorative,
                inert, and removed before anyone eats.
              </p>

              <p>
                This is not a data problem. It is a language problem. When a
                number modifies a noun instead of driving a verb, it has become
                an adjective. And adjectives are the enemy of decision-making.
              </p>

              <p>
                The distinction matters because adjective-numbers absorb budget.
                They require pipelines, dashboards, analysts, and
                infrastructure&mdash;all to produce a decoration that changes
                nothing. The number exists, the slide is &ldquo;data-driven,&rdquo;
                and the meeting ends with the same decision that would have been
                made without it.
              </p>

              <h2>The adjective test</h2>

              <p>
                Before any number earns real estate on a slide, in a dashboard,
                or in an executive summary, it must survive three questions:
              </p>

              <ol>
                <li>
                  <strong>What decision does this number inform?</strong> If the
                  answer is &ldquo;none specifically,&rdquo; the number is an
                  adjective.
                </li>
                <li>
                  <strong>What threshold triggers action?</strong> If there is no
                  threshold&mdash;no line in the sand that changes behavior&mdash;the
                  number is decorative.
                </li>
                <li>
                  <strong>Who owns the response?</strong> If no one is
                  accountable for acting when the number crosses its threshold,
                  you have built a weather report, not an operating system.
                </li>
              </ol>

              <blockquote>
                <p>
                  A dashboard is not a deliverable. A dashboard is a hypothesis
                  about what information will change behavior. Most hypotheses
                  are wrong.
                </p>
              </blockquote>

              {/* Big stat figure */}
              <figure className="stat-figure">
                <div className="stat-number">4/5</div>
                <figcaption className="stat-caption">
                  executive dashboards I audit contain at least one metric that
                  no one can connect to a decision, a threshold, or an owner.
                </figcaption>
              </figure>

              <h2>What this means for your stack</h2>

              <p>
                If you accept this framing, the implications for data
                infrastructure are immediate and uncomfortable:
              </p>

              <ul>
                <li>
                  <strong>Kill the vanity layer.</strong> Any metric without a
                  decision, threshold, and owner gets archived. Not deprecated.
                  Archived. Gone from the UI.
                </li>
                <li>
                  <strong>Denominator before numerator.</strong> Before you build
                  a new metric, define what &ldquo;good&rdquo; looks like. If
                  you cannot state the denominator, you are not ready to measure
                  the numerator.
                </li>
                <li>
                  <strong>Action-routing over visualization.</strong> The highest
                  ROI data work is not a better chart. It is a system that routes
                  the right number to the right person at the right time with the
                  right context to act.
                </li>
                <li>
                  <strong>Fewer dashboards, more decision logs.</strong> Track
                  what decisions were made, what data informed them, and what
                  happened next. This is your real analytics maturity signal.
                </li>
              </ul>

              {/* Fig. 2 — Decision-metric mapping framework */}
              <figure className="diagram-figure">
                <img
                  src="/decision-metric-framework.svg"
                  alt="Decision-metric mapping framework: a flowchart showing how metrics are filtered through three gates (Decision, Threshold, Owner) to become either actionable evidence or archived adjectives"
                  className="diagram-svg"
                />
                <figcaption>
                  Fig. 2 &mdash; Decision-metric mapping framework. Every metric
                  passes through three gates before earning dashboard real estate.
                  Fail any gate and it&rsquo;s an adjective&mdash;archive it.
                </figcaption>
              </figure>

              <h2>The uncomfortable part</h2>

              <p>
                Most data teams do not want to hear this. They have spent years
                building the infrastructure, the pipelines, the dashboards. The
                suggestion that much of it is decorative feels like an
                accusation. It is not.
              </p>

              <p>
                It is a reframing. The work was not wasted&mdash;it built the
                muscle. But the muscle has been flexed in service of adjectives.
                The next phase is using that same infrastructure to drive verbs:
                to trigger, to route, to escalate, to resolve.
              </p>

              <p>
                The test is simple. Look at your last board deck. For every
                number on every slide, ask: if I removed this number, would
                anything in this room change? If the answer is no, you have found
                an adjective. Cut it. Redeploy the effort toward a number that
                moves something.
              </p>

              {/* Footnotes */}
              <section className="footnotes">
                <h3>Notes</h3>
                <ol className="fn-list">
                  <li className="fn" id="fn-1">
                    <span className="fn-ref">1</span>
                    The &ldquo;adjective test&rdquo; framing originates from an
                    internal operating memo I wrote for a logistics client in
                    2024. The three questions have since been adopted by their
                    product and data teams as a gating mechanism for new metric
                    requests.
                  </li>
                  <li className="fn" id="fn-2">
                    <span className="fn-ref">2</span>
                    The 4/5 statistic is drawn from 23 dashboard audits conducted
                    across seven organizations between 2022 and 2025. Sample
                    skews toward mid-market B2B companies with 200&ndash;2,000
                    employees.
                  </li>
                </ol>
              </section>
            </article>

            {/* Right empty column */}
            <div className="margin-rail-right" />
          </div>
        </div>
      </section>

      {/* Post Pager */}
      <nav className="post-pager section">
        <div className="wrap">
          <div className="pager-grid">
            <a href="#" className="pager-cell pager-prev">
              <span className="pager-dir">&larr; Previous</span>
              <span className="pager-title">
                The build-vs-buy question is usually a staffing question
              </span>
            </a>
            <a href="#" className="pager-cell pager-next">
              <span className="pager-dir">Next &rarr;</span>
              <span className="pager-title">
                What a fractional CIO actually does all day
              </span>
            </a>
          </div>
        </div>
      </nav>

      <BrandFooter />
    </div>
  );
};

export default Writing;
