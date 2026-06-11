import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Redesign.css";
import "./NotFound.css";
import BrandTopbar from "@/components/BrandTopbar";
import SearchOverlay from "@/components/SearchOverlay";

const NotFound = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="nf-page">
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BrandTopbar variant="dark" activePage="" onSearchOpen={() => setSearchOpen(true)} />

      <main className="nf">
        <div className="nf-left">
          <span className="nf-code">
            <span className="nf-dot" />
            HTTP 404 &middot; Resource not found
          </span>

          <h1>
            Lost the <em>signal</em>
            <span className="nf-dash">&mdash;</span>
          </h1>

          <p className="nf-sub">
            This page has no denominator, no owner, and no threshold&mdash;so by
            house rules, it doesn&rsquo;t exist. The pages below do.
          </p>

          <div className="nf-actions">
            <Link to="/" className="nf-btn nf-btn-primary">
              Back to the index &rarr;
            </Link>
            <button
              className="nf-btn nf-btn-secondary"
              onClick={() => setSearchOpen(true)}
            >
              Search the site &#8984;K
            </button>
            <Link to="/chat" className="nf-btn nf-btn-secondary">
              Ask the concierge &rarr;
            </Link>
          </div>
        </div>

        <div className="nf-right">
          <div className="incident-label">
            <span>Incident report</span>
            <span>JLS-404</span>
          </div>
          <div className="incident">
            <div className="incident-row">
              <span className="incident-key">Status</span>
              <span className="incident-val incident-heat">
                404 &mdash; Not found
              </span>
            </div>
            <div className="incident-row">
              <span className="incident-key">Requested</span>
              <span className="incident-val">{location.pathname}</span>
            </div>
            <div className="incident-row">
              <span className="incident-key">Denominator</span>
              <span className="incident-val">none on record</span>
            </div>
            <div className="incident-row">
              <span className="incident-key">Owner</span>
              <span className="incident-val">unassigned</span>
            </div>
            <div className="incident-row">
              <span className="incident-key">Threshold</span>
              <span className="incident-val">n/a</span>
            </div>
            <div className="incident-row">
              <span className="incident-key">Verdict</span>
              <span className="incident-val incident-verdict">
                adjective &mdash; cut from the deck
              </span>
            </div>
            <div className="incident-row incident-row-last">
              <span className="incident-key">Recovery</span>
              <span className="incident-val">index &middot; &#8984;K &middot; concierge</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="nf-foot">
        <span>jonathanlynshue.com</span>
        <span>Every reader &middot; Every device &middot; Even here</span>
        <span>&copy; MMXXVI</span>
      </footer>
    </div>
  );
};

export default NotFound;
