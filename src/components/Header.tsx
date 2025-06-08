import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-xl text-gray-900">Your Name</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("work")}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection("leadership")}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Leadership
            </button>
            <button
              onClick={() => scrollToSection("strategy")}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Strategy
            </button>
            <button
              onClick={() => scrollToSection("collaboration")}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Collaboration
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => scrollToSection("work")}
                className="text-left text-gray-700 hover:text-gray-900 py-2"
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection("leadership")}
                className="text-left text-gray-700 hover:text-gray-900 py-2"
              >
                Leadership
              </button>
              <button
                onClick={() => scrollToSection("strategy")}
                className="text-left text-gray-700 hover:text-gray-900 py-2"
              >
                Strategy
              </button>
              <button
                onClick={() => scrollToSection("collaboration")}
                className="text-left text-gray-700 hover:text-gray-900 py-2"
              >
                Collaboration
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-gray-700 hover:text-gray-900 py-2"
              >
                About
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
