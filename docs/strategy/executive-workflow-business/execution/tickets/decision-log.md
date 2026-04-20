---
date: 2026-04-20
agent: goose
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
| 15 | 2026-04-19 | UI Automation MCP assessment is P0 priority | Multiple tickets blocked by "needs manual browser work" | Continue with manual work, hire VA, skip UI-dependent tasks | If the right UI automation tool is identified, every remaining manual ticket (HubSpot, LinkedIn, Firebase console, Cal.com, Tally) becomes automatable by the AI agent | Unblocks EWB-003, 007, 013; new ticket EWB-015 created | Jon |
| 16 | 2026-04-19 | Create 3 new tickets for migration aftermath | Codex session delivered Firebase/Cloud Run branch with 10 remaining manual steps | Absorb into existing tickets, ignore migration | Clean ticket tracking: EWB-013 (infrastructure), EWB-014 (merge PR), EWB-015 (UI automation). Affected tickets noted in README | 3 new backlog tickets; 5 existing tickets flagged for update | Cline + Jon |
| 17 | 2026-04-20 | Workload Identity Federation (not service account key) for CI/CD | GH Actions needs GCP auth for deploy | Store service account JSON key as GitHub secret | Keyless auth is more secure; no stored credentials to rotate; Google's recommended approach | No secret rotation burden; uses OIDC token exchange | Goose |
| 18 | 2026-04-20 | Add `/health` alias alongside `/healthz` | Cloud Run LB reserves `/healthz` at infrastructure level, returns Google 404 | Change all references to `/health`, remove `/healthz` entirely | Keeping both is backward-compatible; `/health` works through Cloud Run LB; `/healthz` still works direct-to-container | Zero-downtime fix; no client changes needed | Goose |
| 19 | 2026-04-20 | Move `HUBSPOT_STAGE_EVENT_MAP_JSON` to GCP Secret Manager | JSON commas broke `deploy-cloudrun` action's `^,^`-delimited `env_vars` parser | Escape commas, base64-encode the value, split into multiple env vars | Secret Manager is the intended mechanism for complex values in Cloud Run; cleaner and more secure | Decouples JSON config from CI pipeline parsing | Goose |
| 20 | 2026-04-20 | Force-push feature branch as new `main` | Original PR merge via GitHub API only carried 2 files to main (PR diff, not full tree) | Cherry-pick missing files, create new PR with full content | Feature branch had the complete 172-file project; force-push is cleanest single-step fix | All files correct on main; CI/CD immediately functional | Goose + Jon |
| 21 | 2026-04-20 | Use REST APIs over browser automation where available | EWB-013 R9 (Cal.com) and R10 (Tally) could use UI or API | Browser automation via Playwright/Kapture for all vendor tasks | APIs are faster, more reliable, repeatable, and version-controllable. Hierarchy: CLI > API > Playwright > Kapture > Manual | Cal.com webhook + Tally form created in <5 min via API vs. ~30 min via browser | Goose |
| 22 | 2026-04-20 | Store vendor API keys in macOS Keychain | Cal.com and Tally API keys needed for CLI automation | Store in .env.master, store in GitHub secrets, paste inline | Keychain prevents leakage into shell history, env files, or git; retrievable via `security find-generic-password` | Keys never appear in plaintext outside Keychain | Jon + Goose |

## How to Use This Log

- **Add a row** for every decision that affects strategy, architecture, tooling, or messaging
- **Context** should explain why the decision came up
- **Alternatives** should list what else was considered
- **Rationale** should explain why this option won
- **Impact** should note what changed as a result
