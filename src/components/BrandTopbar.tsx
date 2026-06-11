import { Link } from "react-router-dom";

interface BrandTopbarProps {
  variant?: "light" | "dark";
  activePage: string;
  onSearchOpen: () => void;
}

export default function BrandTopbar({
  variant = "light",
  activePage,
  onSearchOpen,
}: BrandTopbarProps) {
  return (
    <div
      className={"topbar" + (variant === "dark" ? " on-ink" : "")}
      style={{ position: "sticky", top: 0, zIndex: 50 }}
    >
      <div className="topbar-inner">
        <Link to="/" className="top-mark">
          JL<span className="dash">—</span>S
        </Link>
        <nav className="top-nav">
          <Link
            to="/"
            className={"nav-link" + (activePage === "index" ? " active" : "")}
          >
            Index
          </Link>
          <Link
            to="/work"
            className={"nav-link" + (activePage === "work" ? " active" : "")}
          >
            Work
          </Link>
          <Link
            to="/writing"
            className={
              "nav-link" + (activePage === "writing" ? " active" : "")
            }
          >
            Writing
          </Link>
          <Link
            to="/lab"
            className={"nav-link" + (activePage === "lab" ? " active" : "")}
          >
            Lab
          </Link>
          <Link
            to="/chat"
            className={"nav-link" + (activePage === "chat" ? " active" : "")}
          >
            Ask
          </Link>
          <Link
            to="/about"
            className={"nav-link" + (activePage === "about" ? " active" : "")}
          >
            About
          </Link>
          <button className="search-btn" onClick={onSearchOpen} type="button">
            Search <span className="kbd">⌘K</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
