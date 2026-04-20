---
date: 2026-04-19
agent: cline
category: execution-plan
tags: [ui-automation, mcp, browser-control, assessment]
---

# UI Automation MCP Assessment

## Purpose

Evaluate and recommend the best browser automation MCP tools for full UI control by LLM agents. This unblocks all remaining tickets that require browser interaction (HubSpot pipeline, LinkedIn profile, Firebase console, Cal.com/Tally config).

## Tools Evaluated

### Tier 1: Production-Ready MCP Servers

#### 1. Playwright MCP (Microsoft)
| Attribute | Detail |
|-----------|--------|
| **Repo** | github.com/microsoft/playwright-mcp |
| **Stars** | ~31,000 |
| **License** | Apache-2.0 (free) |
| **MCP Server** | ✅ First-class — this IS an MCP server |
| **Install** | `npx @playwright/mcp@latest` |
| **Selector Strategy** | **Accessibility tree snapshots** (primary) — no vision models needed. Optional vision mode for coordinate-based. Supports `data-testid` selectors. |
| **Headed/Headless** | Headed by default, headless via `--headless` |
| **Auth Handling** | **Persistent user profile** — saves cookies/state across sessions. Also supports `--storage-state` for pre-loaded auth, `--user-data-dir` for custom profiles, browser extension to connect to existing logged-in sessions |
| **Key Tools** | `browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot` (accessibility tree), `browser_take_screenshot`, `browser_fill_form`, `browser_select_option`, `browser_evaluate`, `browser_tabs`, `browser_file_upload` |
| **Strengths** | Microsoft-maintained, 31k stars, accessibility-tree-first (most reliable for LLMs), persistent auth, headed mode, tab management, form filling, CI/CD ready |
| **Weaknesses** | Launches its own browser (doesn't use your existing logged-in Chrome), accessibility tree can be verbose for complex pages |
| **Best For** | Form filling, multi-step flows, authenticated sessions, CI automation |

#### 2. Kapture MCP (Already Connected)
| Attribute | Detail |
|-----------|--------|
| **Repo** | github.com/williamkapke/kapture |
| **Stars** | ~127 |
| **License** | MIT |
| **MCP Server** | ✅ Connected in current environment |
| **Install** | `npx -y kapture-mcp@latest bridge` + Chrome extension |
| **Selector Strategy** | CSS selectors and XPath — first matching element |
| **Headed/Headless** | **Headed only** — uses your actual browser with DevTools panel |
| **Auth Handling** | **Uses existing browser sessions** — biggest advantage. No re-authentication needed. |
| **Key Tools** | `navigate`, `click`, `fill`, `hover`, `keypress`, `screenshot`, `elements`, `dom`, `elementsFromPoint` |
| **Strengths** | Works with existing logged-in sessions (HubSpot, LinkedIn already authenticated), multi-tab, real-time visibility |
| **Weaknesses** | DevTools panel must be active for click/fill; timeouts on some sites; CSS selectors less reliable than accessibility tree for dynamic UIs |
| **Best For** | Working with already-authenticated services, quick navigation/screenshot tasks |

#### 3. Browser Use
| Attribute | Detail |
|-----------|--------|
| **Repo** | github.com/browser-use/browser-use |
| **Stars** | ~67,000+ |
| **License** | MIT |
| **MCP Server** | ✅ Via `browser-use/mcp` |
| **Install** | `pip install browser-use` / MCP via community server |
| **Selector Strategy** | **DOM extraction + LLM reasoning** — extracts interactive elements, indexes them, LLM picks by index. Optional vision mode. |
| **Headed/Headless** | Both — built on Playwright |
| **Auth Handling** | Persistent browser context, cookie injection, profile directory support |
| **Key Tools** | High-level actions: `go_to_url`, `click_element`, `input_text`, `extract_page_content`, `scroll`, `switch_tab`, `go_back` |
| **Strengths** | Most popular (67k stars), designed specifically for AI agents, automatic retry, LLM-native element selection, multi-tab, extensible with custom actions |
| **Weaknesses** | Python-only, heavier setup than Playwright MCP, community MCP server (not official), more complex architecture |
| **Best For** | Complex multi-step flows, agent-native browser control, research tasks |

### Tier 2: Specialized Tools

#### 4. Stagehand (Browserbase)
| Attribute | Detail |
|-----------|--------|
| **Repo** | github.com/browserbase/stagehand |
| **Stars** | ~14,000+ |
| **License** | MIT |
| **MCP Server** | ✅ Built-in MCP server mode |
| **Selector Strategy** | Hybrid: accessibility tree (a11y) + vision + DOM locator scripts |
| **Key API** | `act()`, `extract()`, `observe()` — natural language actions |
| **Strengths** | Natural language interface ("click the submit button"), dual a11y+vision, Browserbase cloud option |
| **Weaknesses** | Requires API key for vision features (OpenAI), TypeScript-only, more complex than Playwright MCP |
| **Best For** | Natural language browser control, extraction tasks |

#### 5. Computer Use MCP (Anthropic-style)
| Attribute | Detail |
|-----------|--------|
| **Repo** | github.com/AB498/computer-control-mcp (community) |
| **Stars** | ~137 |
| **License** | MIT |
| **Selector Strategy** | **Pixel/coordinate-based** — screenshots + OCR + mouse/keyboard |
| **Strengths** | Works with any app (not just browsers), OS-level control |
| **Weaknesses** | Slow (screenshot per action), unreliable for form filling, no DOM awareness, community-maintained |
| **Best For** | Last resort for non-web UIs, desktop app automation |

#### 6. Puppeteer (Cline Built-in)
| Attribute | Detail |
|-----------|--------|
| **MCP Server** | N/A — built into Cline as `browser_action` tool |
| **Selector Strategy** | **Coordinate-based** — click at x,y from screenshot |
| **Headed/Headless** | Headed (Chromium launched by Cline) |
| **Auth Handling** | No persistent sessions — fresh browser each launch |
| **Strengths** | Always available, zero setup, good for verification screenshots |
| **Weaknesses** | Coordinate-based clicking is fragile, no form filling tool, no persistent auth, one tab only |
| **Best For** | Quick visual verification, simple click sequences |

#### 7. Chrome DevTools MCP
| Attribute | Detail |
|-----------|--------|
| **Repo** | github.com/benjaminr/chrome-devtools-mcp |
| **Stars** | ~300+ |
| **License** | MIT |
| **Strengths** | Network monitoring, console access, JavaScript execution, storage access |
| **Weaknesses** | Debugging-focused, not designed for UI interaction/form filling |
| **Best For** | Debugging, network inspection, JS execution — not UI automation |

#### 8. Steel MCP
| Attribute | Detail |
|-----------|--------|
| **Stars** | ~4,000+ |
| **License** | Apache-2.0 |
| **Strengths** | Session management, anti-detection, proxy support |
| **Weaknesses** | Cloud-hosted (paid), headless-only, scraping-focused |
| **Best For** | Web scraping at scale, not interactive UI tasks |

#### 9. AgentQL
| Attribute | Detail |
|-----------|--------|
| **Stars** | ~2,000+ |
| **Strengths** | Semantic queries ("find the login button"), natural language selectors |
| **Weaknesses** | Requires API key (paid), limited MCP support |
| **Best For** | Data extraction, semantic element finding |

## Comparison Matrix

| Tool | LLM Compat (0.25) | UI Reliability (0.20) | Auth (0.15) | Headed (0.10) | Selectors (0.10) | Speed (0.05) | Cost (0.05) | MCP Maturity (0.10) | **Weighted Score** |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Playwright MCP** | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | **4.95** |
| **Browser Use** | 5 | 4 | 4 | 5 | 4 | 3 | 5 | 3 | **4.25** |
| **Kapture** | 4 | 3 | 5 | 5 | 3 | 4 | 5 | 3 | **3.85** |
| **Stagehand** | 4 | 4 | 3 | 4 | 5 | 3 | 3 | 4 | **3.80** |
| **Puppeteer (Cline)** | 3 | 2 | 1 | 5 | 2 | 4 | 5 | 5 | **3.00** |
| **Computer Use** | 3 | 2 | 2 | 3 | 1 | 1 | 5 | 2 | **2.35** |
| **Chrome DevTools** | 2 | 1 | 3 | 4 | 1 | 4 | 5 | 2 | **2.20** |
| **Steel** | 3 | 3 | 3 | 1 | 3 | 4 | 2 | 3 | **2.85** |
| **AgentQL** | 3 | 3 | 2 | 3 | 4 | 3 | 2 | 2 | **2.80** |

## Recommendation

### Primary Tool: **Playwright MCP** (Score: 4.95/5)

**Why:**
1. **Accessibility tree snapshots** are the most reliable selector strategy for LLMs — structured, deterministic, no coordinate guessing
2. **Persistent user profiles** solve the auth problem — log in once, reuse across sessions
3. **Microsoft-maintained** with 31k stars — not going anywhere
4. **Already available** in our MCP config (just needs connection)
5. **Form filling** (`browser_fill_form`) is purpose-built for the kind of work we need (HubSpot forms, LinkedIn fields)
6. **Tab management** supports multi-step workflows
7. **Headed mode** lets Jon see what's happening

### Fallback Tool: **Kapture MCP** (Score: 3.85/5)

**Why:**
- Already connected and working
- Uses existing authenticated browser sessions (no re-login)
- Good for quick navigation and screenshot tasks
- Falls back gracefully when Playwright can't access a site with existing auth

### Usage Pattern

```
For form filling, account setup, multi-step flows:
  → Playwright MCP (reliable selectors, persistent auth, form tools)

For already-authenticated quick tasks:
  → Kapture MCP (uses existing browser sessions)

For visual verification:
  → Puppeteer (Cline built-in, always available)

For complex agent workflows (future):
  → Browser Use (when more sophisticated agent patterns are needed)
```

## Setup Instructions

### Playwright MCP

Already configured in `.mcp.json` as `playwright`. To activate:

```bash
# Test connection
npx @playwright/mcp@latest --help

# With headed mode (default) — user can see the browser
npx @playwright/mcp@latest

# With persistent profile (preserves auth across sessions)
# Default profile: ~/Library/Caches/ms-playwright/mcp-chromium-{hash}
```

**First-time auth setup:**
1. Start Playwright MCP in headed mode
2. Navigate to HubSpot, LinkedIn, Cal.com, etc.
3. Log in manually once
4. Playwright saves the session — subsequent launches are pre-authenticated

### Kapture MCP (Already Working)

No setup needed — already connected. Use for tasks where existing Chrome auth is needed.

## Tickets Unblocked

With Playwright MCP as primary:
- **EWB-003** (LinkedIn Profile) — `browser_fill_form` for headline, about, experience fields
- **EWB-007** (HubSpot Pipeline) — navigate to settings, create pipeline stages via form interactions
- **EWB-013** (Firebase Console) — create project, configure services via GCP console forms
- **EWB-001** (remaining tool configs) — Cal.com event setup, Tally form creation
