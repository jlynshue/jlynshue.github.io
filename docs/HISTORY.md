# History — `jlynshue/jlynshue.github.io`



## Baseline Tags

| Tag | Date | Note |
|---|---|---|
| `phase-0-baseline` | 2026-04-24 | Pre-revamp baseline. See `~/code-projects/docs/plans/2026-04-codebase-revamp.md` Phase 0. |
| `phase-1-baseline` | 2026-04-25 | Post-transfer baseline (if repo was transferred). |
| `phase-2-baseline` | 2026-04-25 | Post-scaffolding baseline (this file + `CLAUDE.md` + `AGENTS.md` + baseline CI). |

## Merged PRs

| # | Title | State | Author | Merged | URL |
|---|---|---|---|---|---|
| #17 | fix(linkedin): use share URN for comments | MERGED | @jlynshue | 2026-04-24T05:49:34Z | https://github.com/jlynshue/jlynshue.github.io/pull/17 |
| #16 | fix: remove GrowthBook SDK — eliminates Missing GrowthBookProvider error | MERGED | @jlynshue | 2026-04-22T01:41:41Z | https://github.com/jlynshue/jlynshue.github.io/pull/16 |
| #15 | fix: guard GrowthBook SDK when no client key is set | MERGED | @jlynshue | 2026-04-22T01:31:09Z | https://github.com/jlynshue/jlynshue.github.io/pull/15 |
| #14 | fix: wrap app with GrowthBookProvider + measurement plan | MERGED | @jlynshue | 2026-04-22T01:20:53Z | https://github.com/jlynshue/jlynshue.github.io/pull/14 |
| #13 | feat(analytics): GA4 tracking + CTA click events + scroll depth | MERGED | @jlynshue | 2026-04-21T21:44:17Z | https://github.com/jlynshue/jlynshue.github.io/pull/13 |
| #12 | feat: LinkedIn publishing via Cloud Run + Cloud Scheduler | MERGED | @jlynshue | 2026-04-21T20:03:39Z | https://github.com/jlynshue/jlynshue.github.io/pull/12 |
| #11 | docs: diagnostic and sprint proposal templates | MERGED | @jlynshue | 2026-04-20T23:21:53Z | https://github.com/jlynshue/jlynshue.github.io/pull/11 |
| #10 | feat: A/B testing infrastructure with GrowthBook (Sprint 5 / EWB-010) | MERGED | @jlynshue | 2026-04-20T22:16:00Z | https://github.com/jlynshue/jlynshue.github.io/pull/10 |
| #9 | docs: README, API reference, architecture, and JSDoc (Sprint 2) | MERGED | @jlynshue | 2026-04-20T22:12:17Z | https://github.com/jlynshue/jlynshue.github.io/pull/9 |
| #2 | test: expand server test coverage to 62 tests (Sprint 1) | MERGED | @jlynshue | 2026-04-20T22:03:39Z | https://github.com/jlynshue/jlynshue.github.io/pull/2 |
| #1 | [codex] refresh site and add firebase cloud run stack | MERGED | @jlynshue | 2026-04-20T15:41:34Z | https://github.com/jlynshue/jlynshue.github.io/pull/1 |

## Commit Log (most recent 500)

| hash | date | author | subject |
|---|---|---|---|
| abbf37b | 2026-04-24 01:49:34 -0400 | jlynshue | fix(linkedin): use share URN for comments instead of activity URN (#17) |
| 2d33a41 | 2026-04-21 23:42:41 -0400 | Jonathan Lyn-Shue | docs: update ticket board — 10 done, 2 in-progress, 3 backlog |
| 597c2e4 | 2026-04-21 21:41:40 -0400 | jlynshue | fix: remove GrowthBook SDK entirely — eliminates console error (#16) |
| 773fcf3 | 2026-04-21 21:31:09 -0400 | jlynshue | fix: guard GrowthBook SDK when no client key is set (#15) |
| 5468fc6 | 2026-04-21 21:20:53 -0400 | jlynshue | fix: wrap app with GrowthBookProvider + measurement plan (#14) |
| afd837a | 2026-04-21 17:44:17 -0400 | jlynshue | feat(analytics): add GA4 tracking (G-4HKLKWE5ZD) + measurement plan (#13) |
| cb1b5f2 | 2026-04-21 16:03:38 -0400 | jlynshue | Merge pull request #12 from jlynshue/feat/linkedin-publishing |
| 1814876 | 2026-04-21 16:01:04 -0400 | Jonathan Lyn-Shue | feat(linkedin): add server-side LinkedIn publishing routes |
| e134b89 | 2026-04-20 19:21:53 -0400 | jlynshue | Merge pull request #11 from jlynshue/feat/proposal-templates |
| dcfd232 | 2026-04-20 19:20:11 -0400 | Jonathan Lyn-Shue | docs: add diagnostic and sprint proposal templates (EWB-007) |
| fbb690b | 2026-04-20 18:16:00 -0400 | jlynshue | Merge pull request #10 from jlynshue/feat/ab-testing |
| 9be7e2c | 2026-04-20 18:15:07 -0400 | Jonathan Lyn-Shue | chore: update lockfile for @growthbook/growthbook-react |
| 153792f | 2026-04-20 18:14:37 -0400 | Jonathan Lyn-Shue | test: add tests for GET /r/experiment-exposure endpoint |
| 06d5ab2 | 2026-04-20 18:14:01 -0400 | Jonathan Lyn-Shue | feat: add GET /r/experiment-exposure endpoint for tracking experiment exposures |
| d80b63d | 2026-04-20 18:13:33 -0400 | Jonathan Lyn-Shue | feat: add GrowthBook A/B test for hero headline text |
| 31d1dc7 | 2026-04-20 18:12:57 -0400 | Jonathan Lyn-Shue | feat: add GrowthBook integration with streaming init and experiment tracking |
| a6e2c2f | 2026-04-20 18:12:54 -0400 | Jonathan Lyn-Shue | feat: add GrowthBook integration library |
| 0bc31f8 | 2026-04-20 18:12:17 -0400 | jlynshue | Merge pull request #9 from jlynshue/feat/documentation |
| 39c4a8d | 2026-04-20 18:10:19 -0400 | Jonathan Lyn-Shue | docs: add JSDoc comments to exported functions in utils, dispatcher, repository, and vendors |
| d73d673 | 2026-04-20 18:08:40 -0400 | Jonathan Lyn-Shue | docs: add architecture overview with system diagrams and flows |
| 7ef9c93 | 2026-04-20 18:07:34 -0400 | Jonathan Lyn-Shue | docs: add comprehensive API reference with curl examples for all server routes |
| 9c1a4f9 | 2026-04-20 18:05:32 -0400 | Jonathan Lyn-Shue | docs: add full project README with tech stack, routes, and setup instructions |
| 6199237 | 2026-04-20 18:05:29 -0400 | Jonathan Lyn-Shue | docs: add README.md |
| 4aab16a | 2026-04-20 18:03:39 -0400 | jlynshue | Merge pull request #2 from jlynshue/feat/test-coverage |
| 7438bb8 | 2026-04-20 18:01:43 -0400 | Jonathan Lyn-Shue | docs: update all ticket statuses, add completion report and phase 2A plans |
| 0f46250 | 2026-04-20 18:01:43 -0400 | Jonathan Lyn-Shue | fix: restore loadConfig alias and fix config test for NODE_ENV=test |
| 7221a3d | 2026-04-20 17:59:35 -0400 | Jonathan Lyn-Shue | test: add unit tests for buildConfig() configuration defaults and env reading |
| 8f44894 | 2026-04-20 17:58:27 -0400 | Jonathan Lyn-Shue | test: add health, webhook, internal sync, 404, and static asset tests to app spec |
| eeff5b0 | 2026-04-20 17:57:42 -0400 | Jonathan Lyn-Shue | test: add unit tests for PostHog and HubSpot vendor clients |
| 43bf926 | 2026-04-20 17:56:37 -0400 | Jonathan Lyn-Shue | test: add unit tests for MemoryTrackingStore public methods |
| fe33aec | 2026-04-20 17:55:52 -0400 | Jonathan Lyn-Shue | feat: add MemoryDispatcher class and unit tests for both dispatchers |
| 5bf0d72 | 2026-04-20 12:35:55 -0400 | Jonathan Lyn-Shue | fix(server): remove undefined value from Firestore delivery doc (use omission instead) |
| 3d52d2d | 2026-04-20 12:27:08 -0400 | Jonathan Lyn-Shue | fix(deploy): add build step for Firebase Hosting, add /health route alias, update tickets |
| 08977ca | 2026-04-19 15:19:07 -0400 | Jonathan Lyn-Shue | add implementation summary doc |
| 46403c0 | 2026-04-19 15:06:35 -0400 | Jonathan Lyn-Shue | refresh site and add firebase cloud run stack |
| daf4b40 | 2026-03-27 02:28:27 -0400 | Jonathan Lyn-Shue | content: polish copy — upgrade language, fix jargon, improve value props |
| 1f92e9a | 2026-03-27 02:17:12 -0400 | Jonathan Lyn-Shue | content: remove inaccurate 10K transaction claim from Anuba engagement |
| 93f9bb2 | 2026-03-27 02:13:34 -0400 | Jonathan Lyn-Shue | content: update copy with 15+ years experience, Razorfish/Stellantis details, brand strip |
| 77686a6 | 2026-03-27 01:15:48 -0400 | Jonathan Lyn-Shue | fix: update Calendly links, bio, email, OG tags, remove dead proposals link |
| ee52917 | 2026-03-11 02:53:34 -0700 | Jonathan Lyn-Shue | Remove proposals code-entry portal and nav link |
| 4b51af7 | 2026-03-06 22:37:43 -0500 | Jonathan Lyn-Shue | Update DenMother redirect URLs to use clients.jonathanlynshue.com |
| da8f1db | 2026-03-06 22:21:50 -0500 | Jonathan Lyn-Shue | Update proposal redirects to custom domains |
| be91004 | 2026-03-06 22:14:34 -0500 | Jonathan Lyn-Shue | Fix SPA routing on GitHub Pages — add path restore script |
| de8f656 | 2026-03-06 22:11:36 -0500 | Jonathan Lyn-Shue | Add DenMother proposal redirects + GA4 SPA tracking |
| 9618226 | 2026-03-06 16:48:24 -0500 | Jonathan Lyn-Shue | Add redirect support for proposal codes that link to external data rooms |
| 044b8fd | 2026-03-06 00:37:44 -0500 | Jonathan Lyn-Shue | Add proposals code entry page for gated client access |
| 9db2840 | 2026-03-05 21:36:20 -0500 | Jonathan Lyn-Shue | Redesign site as "The Advisor" — freelance consulting portfolio + proposals portal |
| 549f0fb | 2025-06-08 12:40:23 -0400 | JLS | Merge and move project to jlynshue.github.io |
| fe1c187 | 2025-06-08 12:30:11 -0400 | JLS | Update configuration for GitHub Pages deployment |
| d679179 | 2025-06-08 02:10:52 +0000 | Builder.io | Update second testimonial with Eddie Lageyre's testimonial |
| c0fb240 | 2025-06-08 02:06:03 +0000 | Builder.io | Update hero section description to focus on business transformation |
| 7ce3235 | 2025-06-08 01:45:55 +0000 | Builder.io | Update name to "Jonathan Lyn-Shue" and change to data products focus |
| 4922c8c | 2025-06-08 01:44:10 +0000 | Builder.io | Update name from "Your Name" to "Jonathan" in HeroSection |
| e7a1dea | 2025-06-08 01:21:11 +0000 | Builder.io | Create Header component for personal website navigation |
| ad89eec | 2025-06-07 18:24:47 -0400 | JLS | Add index.html file |
| 13613ab | 2025-06-07 18:13:13 -0400 | jlynshue | Initial commit |
| 314e0e4 | 2025-06-07 08:56:34 +0000 | Builder.io | Initial commit |

---

*Auto-generated 2026-04-25 by the 2026-04 codebase revamp. PRs and commits reflect repo state at generation time; future changes should be tracked via `gh pr list` and `git log` directly.*
