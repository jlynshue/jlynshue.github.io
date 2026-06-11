import { useState } from "react";
import "./Redesign.css";
import "./Lab.css";
import BrandTopbar from "@/components/BrandTopbar";
import BrandFooter from "@/components/BrandFooter";
import SearchOverlay from "@/components/SearchOverlay";

const apps = [
  {
    name: "Anuba Platform",
    desc: "The product side of the practice — an enterprise IoT data platform that turns building-system telemetry into anomaly detection and operational intelligence. Real customers, real contracts, real AWS bill.",
    pill: "In production",
    foot: "SaaS · B2B Data",
    variant: "dark",
  },
  {
    name: "Metric Contract",
    desc: "A small public tool that lets teams define what 'good' looks like for a metric before building the dashboard. One YAML file, zero vendor lock-in, instant accountability.",
    pill: "Free tool",
    foot: "Web · No signup",
    variant: "signal",
  },
];

const repos = [
  { name: "metric-contract", desc: "Define metric ownership, thresholds, and SLAs in a single YAML contract.", lang: "Python", langClass: "py", stars: 412, badge: "Active" },
  { name: "ledger-diff", desc: "Diff two financial ledger exports and surface the variance. CLI-first.", lang: "Python", langClass: "py", stars: 187, badge: "Active" },
  { name: "lane-sim", desc: "Discrete-event freight lane simulator for capacity planning what-ifs.", lang: "TypeScript", langClass: "ts", stars: 96, badge: "Active" },
  { name: "warehouse-runbooks", desc: "Executable runbook templates for data warehouse incident response.", lang: "Markdown", langClass: "md", stars: 311, badge: "Stable" },
  { name: "five-metrics", desc: "The five metrics every data team should track, as dbt models.", lang: "SQL", langClass: "sql", stars: 258, badge: "Stable" },
  { name: "dotfiles", desc: "Opinionated macOS dev environment. Nix + Homebrew + zsh.", lang: "Shell", langClass: "sh", stars: 44, badge: "Forever WIP" },
];

export default function Lab() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="brand">
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BrandTopbar variant="light" activePage="lab" onSearchOpen={() => setSearchOpen(true)} />

      {/* LAB HEADER */}
      <section className="section" style={{ paddingBottom: "var(--s-8)" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-num">Lab</span>
            <h1
              className="sec-title"
              style={{ fontSize: "clamp(48px, 7vw, 104px)" }}
            >
              Things that run.<span className="dash">&mdash;</span>
            </h1>
          </div>
          <p className="sec-lede">
            Shipped products and open-source tooling. Everything here is in
            production somewhere — the lab is not a junk drawer.
          </p>
        </div>
      </section>

      {/* APPS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-num">01 / Apps</span>
            <h2 className="sec-title">
              Product work<span className="dash">.</span>
            </h2>
          </div>

          <div className="app-grid">
            {apps.map((app) => (
              <div
                key={app.name}
                className={
                  "app-card" + (app.variant === "signal" ? " signal-card" : "")
                }
              >
                <span className="pill signal">
                  <span className="dot" />
                  {app.pill}
                </span>
                <h3>{app.name}</h3>
                <p>{app.desc}</p>
                <div className="app-foot">{app.foot}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN SOURCE */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-num">02 / Open Source</span>
            <h2 className="sec-title">
              Public tooling<span className="dash">.</span>
            </h2>
          </div>
          <p className="sec-lede" style={{ marginTop: 0, marginBottom: "var(--s-7)" }}>
            Small, sharp tools extracted from engagements. MIT-licensed, used in
            production, maintained with intent.
          </p>

          {/* PLACEHOLDER: repo names, descriptions, and star counts are placeholders — replace with real GitHub data */}
          <div className="repo-grid">
            {repos.map((repo) => (
              <div key={repo.name} className="repo">
                <div className="name">{repo.name}</div>
                <p className="desc">{repo.desc}</p>
                <div className="foot">
                  <span className={`lang ${repo.langClass}`}>
                    <span className="dot" />
                    {repo.lang}
                  </span>
                  <span className="stars">{repo.stars}</span>
                  <span className="badge">{repo.badge}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="gh-cta">
            <p>
              Placeholder repos &amp; counts — connect the GitHub API or replace
              with real repository data when ready.
            </p>
            <a
              href="https://github.com/jonathanlyn-shue"
              target="_blank"
              rel="noopener noreferrer"
              className="btn ghost"
            >
              View on GitHub <span className="arr">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
