const projects = [
  {
    name: "correspond-os",
    description:
      "Multi-channel correspondence triage engine — ingest, deduplicate, score, and draft responses across email, CRM, and messaging platforms.",
    tags: ["TypeScript", "Bun", "MCP"],
    url: "https://github.com/jlynshue/correspond-os",
  },
  {
    name: "local-private-orchestration",
    description:
      "Privacy-preserving AI agent with PII detection, secret scanning, and safe MCP file access for local-first workflows.",
    tags: ["Python", "MCP", "Security"],
    url: "https://github.com/jlynshue/local-private-orchestration",
  },
  {
    name: "multi-model-query",
    description:
      "Fan out prompts to multiple AI models in parallel and compare responses — Claude, Codex, Goose, Bedrock, Ollama.",
    tags: ["Python", "asyncio", "Bedrock"],
    url: "https://github.com/jlynshue/multi-model-query",
  },
  {
    name: "open-ats",
    description:
      "Open-source ATS resume scanner with transparent scoring, unlimited scans, and complete audit trails.",
    tags: ["Python", "NLP", "CLI"],
    url: "https://github.com/jlynshue/open-ats",
  },
  {
    name: "leverage-os",
    description:
      "AI-powered strategic self-audit CLI — four Naval Ravikant frameworks via AWS Bedrock.",
    tags: ["Python", "Bedrock", "Strategy"],
    url: "https://github.com/jlynshue/leverage-os",
  },
  {
    name: "Sheila",
    description:
      "Local-first research copilot with voice — Zotero + Obsidian via Anthropic, OpenAI, or Ollama.",
    tags: ["Electron", "Python", "Voice"],
    url: "https://github.com/jlynshue/Sheila",
  },
];

const ProjectsSection = () => (
  <section className="section" id="projects" data-section-id="projects">
    <div className="wrap">
      <div className="sec-head">
        <div className="sec-num">02 / Projects</div>
        <div>
          <h2 className="sec-title">
            Open source. <em>Open thinking.</em>
          </h2>
          <p className="sec-lede">
            Tools I build to solve real problems — privacy, multi-model AI,
            executive productivity, and transparent scoring systems.
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
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="ck">{p.name}</div>
            <p style={{ margin: "var(--s-3) 0", fontSize: 15, lineHeight: 1.5 }}>
              {p.description}
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--s-2)",
                flexWrap: "wrap",
                marginTop: "auto",
              }}
            >
              {p.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: ".06em",
                    padding: "3px 8px",
                    border: "1px solid var(--line)",
                    borderRadius: 3,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
