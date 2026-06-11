import { useState, useEffect, useRef } from "react";
import BrandTopbar from "@/components/BrandTopbar";
import SearchOverlay from "@/components/SearchOverlay";
import { trackChatStarted, trackChatMessage } from "@/lib/analytics";
import "./Redesign.css";
import "./Chat.css";

interface Message {
  role: "bot" | "user";
  content: string;
}

const STORAGE_KEY = "jls-chat-v1";

const WELCOME: Message = {
  role: "bot",
  content:
    "I'm the J—S concierge. I've read the resume, the case studies, and the essays so you don't have to. Ask me about engagements, availability, methodology, or past work.",
};

const CHIPS = [
  "What does a fractional engagement look like?",
  "Are you available Q3 2026?",
  "Tell me about the freight case study.",
  "Build vs. buy — what's your philosophy?",
];

function cannedResponse(input: string): string {
  const q = input.toLowerCase();

  if (/fractional|engagement|cio|cto/i.test(q)) {
    return "A typical engagement starts with a 2-week diagnostic: interview stakeholders, audit systems, map the decision surface. Then I embed 2–3 days/week for 90 days building the first workflow end-to-end — usually a reporting or coordination bottleneck. Deliverable is a working system, not a slide deck. Retainer optional after that.";
  }
  if (/available|availability|q3|book|hire/i.test(q)) {
    return "I'm booking Q3 2026 now. One slot remaining for a fractional CIO/CTO engagement (2–3 days/week, 90-day minimum). Shorter sprints (2–4 weeks) available for scoped builds. Reach out at jonathan.lynshue@gmail.com to discuss fit.";
  }
  if (/freight|case|spreadsheet|logistics/i.test(q)) {
    return "Freight data platform — Case 01. A 3PL running on 14 disconnected spreadsheets. I consolidated into a single decision surface: real-time margin visibility, automated carrier scoring, exception alerts. Result: 40% faster billing cycles, $220K annual cost avoidance identified in month one. 90 days, two-person team.";
  }
  if (/build|buy|vendor/i.test(q)) {
    return "Default to buy. Then ask: does this touch your core differentiation? If yes, build a thin layer on top of bought infrastructure. If no, integrate and move on. Most companies over-build commodity workflows and under-invest in the decision layer that actually compounds. I look for the 80/20 seam.";
  }

  return "I don't have that in the file. For anything outside the resume and case studies, the best move is a direct email: jonathan.lynshue@gmail.com — usually within one business day.";
}

export default function Chat() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }
    setHistory([WELCOME]);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  // Auto-scroll
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history, busy]);

  async function ask(question: string) {
    if (!question.trim() || busy) return;

    const userMessages = history.filter((m) => m.role === "user");
    const isFirst = userMessages.length === 0;
    if (isFirst) trackChatStarted();
    trackChatMessage(question.trim().length, isFirst, userMessages.length + 1);

    const userMsg: Message = { role: "user", content: question.trim() };
    setHistory((h) => [...h, userMsg]);
    setInput("");
    setBusy(true);

    let reply: string;

    // Try live AI if available
    if (
      typeof window !== "undefined" &&
      (window as any).claude?.complete
    ) {
      try {
        reply = await (window as any).claude.complete(question.trim());
      } catch {
        reply = cannedResponse(question);
      }
    } else {
      // Simulate brief thinking delay
      await new Promise((r) => setTimeout(r, 600));
      reply = cannedResponse(question);
    }

    const botMsg: Message = { role: "bot", content: reply };
    setHistory((h) => [...h, botMsg]);
    setBusy(false);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([WELCOME]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input);
    }
  }

  return (
    <div className="brand wp chat-page">
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BrandTopbar
        variant="dark"
        activePage="chat"
        onSearchOpen={() => setSearchOpen(true)}
      />

      <main className="chat-shell">
        {/* Left Rail */}
        <aside className="chat-rail">
          <span className="rail-eyebrow">The Concierge</span>
          <h1 className="rail-title">
            Ask <em>J</em><span className="dash">&mdash;</span><em>S</em>.
          </h1>
          <p className="rail-desc">
            An AI concierge trained on my resume, case studies, and published
            writing. It gives short, direct answers with numbers attached.
          </p>

          <dl className="rail-facts">
            <dt>Trained on</dt>
            <dd>Resume &middot; Cases &middot; Essays</dd>
            <dt>Tone</dt>
            <dd>Short. Declarative. Numbers attached.</dd>
            <dt>Won't do</dt>
            <dd>Pricing quotes, NDA material, adjectives.</dd>
          </dl>

          <p className="rail-foot">
            For serious inquiries &mdash;{" "}
            <a href="mailto:jonathan.lynshue@gmail.com">
              jonathan.lynshue@gmail.com
            </a>
          </p>
        </aside>

        {/* Chat Column */}
        <section className="chat-col">
          <div className="chat-head">
            <div className="chat-avatar">J&mdash;S</div>
            <div className="chat-head-info">
              <span className="chat-name">J&mdash;S Concierge</span>
              <span className="chat-status">
                <span className="status-dot" />
                On the line
              </span>
            </div>
            <button className="reset-btn" onClick={reset} type="button">
              Reset
            </button>
          </div>

          <div className="chat-log" ref={logRef}>
            {history.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {busy && (
              <div className="msg bot typing">
                <span className="dot-pulse" />
              </div>
            )}
          </div>

          <div className="chips">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                className="chip"
                onClick={() => ask(chip)}
                type="button"
                disabled={busy}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={busy}
            />
            <button
              className="send-btn"
              onClick={() => ask(input)}
              type="button"
              disabled={busy || !input.trim()}
            >
              Send
            </button>
          </div>

          <p className="chat-foot">
            AI concierge &middot; may err &middot; not legal/financial advice
          </p>
        </section>
      </main>
    </div>
  );
}
