---
date: 2026-04-18
agent: cline
category: execution-tickets
---

# Decision Log — Executive Workflow Business

All project decisions with context, alternatives, and rationale.

| # | Date | Decision | Context | Alternatives Considered | Rationale | Impact | Decided By |
|---|------|----------|---------|------------------------|-----------|--------|------------|
| 1 | 2026-04-18 | Use all 6 memory/patterns for execution plan | Building comprehensive execution plan | Use only relevant patterns | All 6 patterns had applicable principles — no waste in applying them all | Better-grounded plan with documented methodology | Cline + Jon |
| 2 | 2026-04-18 | Position as "workflow-first, not AI-first" | Website and content strategy | Lead with AI expertise, lead with fractional CIO | Strategy docs explicitly define this positioning; AI certs deprioritized accordingly | All messaging, website, and content aligned to workflow language | Jon (strategy) |
| 3 | 2026-04-18 | $9/month tech stack (open source preferred) | Tool selection for execution | Paid tools (Calendly, Mixpanel, Optimizely) | Capital preservation; free tiers sufficient for Phase 1 traffic; open source avoids lock-in | Plausible, Cal.com, GrowthBook, Buffer, HubSpot Free, Tally, Dub.co | Cline + Jon |
| 4 | 2026-04-18 | MS-102 + ACP-620 certs prioritized over AI certs | Certification strategy | Google AI, AWS ML, Azure AI certs | ICP uses M365 + Jira/Confluence; stack-matching certs > generic AI certs for trust | $415 budget, Month 2–4 timeline | Cline |
| 5 | 2026-04-18 | LinkedIn is the only social channel in Phase 1 | Channel strategy | Multi-channel (X, newsletter, YouTube) | ICP (CIO/COO/Ops) concentrates on LinkedIn; other channels deferred until content inventory exists | 4–5 hours/week on LinkedIn only; no time wasted on low-ROI channels | Jon (strategy) |
| 6 | 2026-04-18 | Warm outbound front-loaded in Week 1 | Revenue strategy | Content-first approach, SEO-first | Strategy identifies warm outbound as fastest path to first revenue; referrals second | 15+ messages sent Week 1 | Cline + Jon |
| 7 | 2026-04-18 | Homepage headline changed from canonical to concise | User feedback: "too wordy" | Keep canonical line, try pain-led variant | "Executive workflow systems that deliver clarity, not noise." is sharper and more professional | Better first impression; passes the 5-second test | Jon |
| 8 | 2026-04-18 | Text logos for Caliber Collision (no image available) | Logo carousel creation | Skip brand, use placeholder image | Text fallback blends with the carousel; Caliber Collision has no public Wikipedia logo | 9/10 real images + 1 text; consistent experience | Cline |
| 9 | 2026-04-18 | Use Kapture MCP for logo extraction | Need actual brand logos | Clearbit API (blocked), direct download (blocked), manual screenshot | Kapture connected to Edge browser; Wikipedia infobox images extractable via selector | 9 logos captured in ~5 minutes | Cline |
| 10 | 2026-04-18 | 3 operating proof cases sufficient for launch | User asked if 3 is enough | Add 2 more cases (5 total) | 3 cases covering different dimensions (Edge AI, Enterprise Data, Workflow) is standard for productized services | Can add more as real engagements close | Cline + Jon |
| 11 | 2026-04-18 | "Schedule a Call" section tightened to 1 sentence | User feedback: "too wordy" | Keep 2 paragraphs, try medium length | "30 minutes. No pitch deck. Let's see if the fit is there." — rest of page already qualifies buyer | Cleaner CTA section; no re-selling | Jon |
| 12 | 2026-04-18 | Footer: Email + LinkedIn + Book a Meeting (replace GitHub) | User feedback | Keep GitHub link, add all 4 | Buyer-facing footer should prioritize contact channels; GitHub is a proof artifact, not a contact method | hello@jonathanlynshue.com, LinkedIn, #contact anchor | Jon |
| 13 | 2026-04-18 | Markdown ticket system over Task Master CLI | Task Master CLI had MCP issues; user wants rich tickets | Fix Task Master CLI, use Jira, use GitHub Issues | Markdown tickets: portable, rich content, audit trail, no tool dependency; task.json preserved as data | 12 ticket files + decision log + folder workflow | Jon |
| 14 | 2026-04-19 | Move website hosting and analytics off GitHub Pages/Plausible onto Firebase Hosting + Cloud Run + PostHog | Need first-party server-side tracking, webhook ingestion, and same-domain attribution | Keep GitHub Pages, keep Plausible, add more frontend tags | Backend redirects, webhooks, and CRM attribution require a real server surface; same-domain cookies matter more than script simplicity | Supersedes website measurement portion of decision #3; adds Firebase, Cloud Run, Firestore, Cloud Tasks, PostHog | Jon + Codex |

## How to Use This Log

- **Add a row** for every decision that affects strategy, architecture, tooling, or messaging
- **Context** should explain why the decision came up
- **Alternatives** should list what else was considered
- **Rationale** should explain why this option won
- **Impact** should note what changed as a result
