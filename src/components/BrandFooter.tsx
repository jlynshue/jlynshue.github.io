import { Link } from "react-router-dom";

export default function BrandFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <h3>
            Let's find the <em>signal</em>
            <span className="dash">&mdash;</span>
          </h3>
          <div className="meta">
            <a href="mailto:jonathan.lynshue@gmail.com">jonathan.lynshue@gmail.com</a>
            <br />
            305 &middot; 484 &middot; 9168
            <br />
            Miami, FL &middot; MMXXVI
          </div>
          <nav className="footer-nav">
            <Link to="/work">Work</Link>
            <Link to="/writing">Writing</Link>
            <Link to="/lab">Lab</Link>
            <Link to="/chat">Ask J&mdash;S</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
        <div className="footer-base">
          <span>jonathanlynshue.com</span>
          <span>Anuba Technologies &middot; JL&mdash;S Consulting</span>
          <span>&copy; MMXXVI</span>
        </div>
      </div>
    </footer>
  );
}
