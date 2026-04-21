import { discoveryCallHref, handleCTAClick } from "@/lib/tracking";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-serif text-white text-lg">Jonathan Lyn-Shue</div>
          <div className="flex gap-6 text-sm">
            <a
              href="mailto:hello@jonathanlynshue.com"
              className="hover:text-white transition-colors"
            >
              Email
            </a>
            <a
              href="https://linkedin.com/in/jonathanlynshue"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={discoveryCallHref("footer")}
              onClick={handleCTAClick("discovery_call", "footer")}
              className="hover:text-white transition-colors"
            >
              Book a Meeting
            </a>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Jonathan Lyn-Shue
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
