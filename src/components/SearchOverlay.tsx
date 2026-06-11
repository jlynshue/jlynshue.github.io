import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { trackSearchOpen, trackSearchQuery, trackSearchResultClick } from "@/lib/analytics";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IndexItem {
  group: string;
  title: string;
  desc: string;
  kind: string;
  href: string;
  keys: string;
}

const INDEX: IndexItem[] = [
  { group: "Pages", title: "Index", desc: "Data & AI executive — enterprise rigor, startup velocity.", kind: "Home", href: "/", keys: "home landing jonathan lyn-shue about" },
  { group: "Pages", title: "Work — Case studies", desc: "Selected engagements, with the numbers attached.", kind: "Work", href: "/work", keys: "case study portfolio client engagement work" },
  { group: "Pages", title: "Lab — Code & apps", desc: "Open-source tools and shipped products.", kind: "Lab", href: "/lab", keys: "github repos apps software open source code lab" },
  { group: "Pages", title: "Ask J—S", desc: "A concierge that has read the resume so you don't have to.", kind: "Chat", href: "/chat", keys: "chat chatbot ai assistant ask questions" },
  { group: "Pages", title: "About & Services", desc: "The practice, the person, the engagement model.", kind: "About", href: "/about", keys: "about services fractional cio cto consulting" },
  { group: "Writing", title: "Numbers are not adjectives", desc: "On using data as evidence, not decoration.", kind: "Essay", href: "/writing", keys: "blog writing essay data ai strategy numbers evidence" },
  { group: "Work", title: "Freight data platform — Case 01", desc: "From 14 spreadsheets to one decision surface in 90 days.", kind: "Case", href: "/work", keys: "logistics freight platform modernization fractional cio" },
  { group: "Contact", title: "jonathan.lynshue@gmail.com", desc: "Email — usually within one business day.", kind: "Email", href: "mailto:jonathan.lynshue@gmail.com", keys: "contact email reach hire" },
  { group: "Contact", title: "linkedin/in/jonathanlynshue", desc: "LinkedIn profile.", kind: "Link", href: "https://linkedin.com/in/jonathanlynshue", keys: "linkedin social profile" },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Filter results
  const results = query.trim()
    ? INDEX.filter((item) => {
        const words = query.toLowerCase().split(/\s+/);
        const haystack = `${item.title} ${item.desc} ${item.keys}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      })
    : INDEX;

  // Group results
  const grouped: { label: string; items: IndexItem[] }[] = [];
  const seen = new Set<string>();
  for (const item of results) {
    if (!seen.has(item.group)) {
      seen.add(item.group);
      grouped.push({ label: item.group, items: [] });
    }
    grouped.find((g) => g.label === item.group)!.items.push(item);
  }

  const flatResults = grouped.flatMap((g) => g.items);

  // Reset selection on query change
  useEffect(() => {
    setSel(0);
  }, [query]);

  // Focus input when opening + track
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSel(0);
      trackSearchOpen("click");
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  // Debounced search query tracking
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      trackSearchQuery(query, results.length);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, results.length]);

  const go = useCallback(
    (item: IndexItem) => {
      trackSearchResultClick(query, item.title, item.href);
      onClose();
      if (item.href.startsWith("mailto:") || item.href.startsWith("http")) {
        window.open(item.href, "_blank", "noopener");
      } else {
        navigate(item.href);
      }
    },
    [navigate, onClose, query]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && flatResults.length > 0) {
        e.preventDefault();
        go(flatResults[sel]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, flatResults, sel, go, onClose]);

  // Global Cmd+K and "/" listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Will be handled by parent toggling isOpen
        }
      }
      if (
        e.key === "/" &&
        !isOpen &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="search-head">
          <span className="dash-mark">J</span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search the practice..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-esc" onClick={onClose}>
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="search-results">
          {flatResults.length === 0 && query.trim() ? (
            <div className="search-empty">
              Nothing for "{query}" —{" "}
              <a
                href="/chat"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  navigate("/chat");
                }}
                style={{ color: "var(--signal)", textDecoration: "underline" }}
              >
                ask the concierge
              </a>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.label}>
                <div className="search-group-label">{group.label}</div>
                {group.items.map((item) => {
                  const idx = flatResults.indexOf(item);
                  return (
                    <div
                      key={item.href + item.title}
                      className={`search-item${idx === sel ? " sel" : ""}`}
                      onMouseEnter={() => setSel(idx)}
                      onClick={() => go(item)}
                    >
                      <div>
                        <div className="t">{item.title}</div>
                        <div className="d">{item.desc}</div>
                      </div>
                      <span className="k">{item.kind}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="search-foot">
          <span>
            <b>&uarr;</b> <b>&darr;</b> navigate
          </span>
          <span>
            <b>&crarr;</b> open
          </span>
          <span>
            <b>esc</b> close
          </span>
        </div>
      </div>
    </div>
  );
}
