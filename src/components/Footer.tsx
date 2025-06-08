import { Button } from "@/components/ui/button";

const Footer = () => {
  const additionalProjects = [
    {
      title: "Open Source UI Library",
      description:
        "A comprehensive React component library used by 50+ companies",
      link: "https://github.com/yourusername/ui-library",
    },
    {
      title: "Developer Productivity Tools",
      description:
        "CLI tools and VS Code extensions to streamline development workflow",
      link: "https://github.com/yourusername/dev-tools",
    },
    {
      title: "Technical Blog Series",
      description:
        "In-depth articles about modern web development and engineering leadership",
      link: "https://yourblog.com",
    },
  ];

  const socialLinks = [
    { name: "Twitter", url: "https://twitter.com/yourusername" },
    { name: "LinkedIn", url: "https://linkedin.com/in/yourprofile" },
    { name: "GitHub", url: "https://github.com/yourusername" },
    { name: "Email", url: "mailto:your.email@example.com" },
    { name: "Resume", url: "#" },
  ];

  const galleryImages = [
    { src: "/placeholder.svg", alt: "Conference Speaking" },
    { src: "/placeholder.svg", alt: "Team Workshop" },
    { src: "/placeholder.svg", alt: "Code Review Session" },
    { src: "/placeholder.svg", alt: "Product Demo" },
  ];

  return (
    <footer id="more" className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Footer Content */}
          <div>
            <h2 className="text-4xl md:text-6xl font-light mb-8 leading-tight">
              There's more
            </h2>

            <p className="text-xl text-gray-400 leading-relaxed mb-12">
              Interested in diving deeper? Here are some additional projects,
              case studies, and resources that showcase different aspects of my
              work and thinking process.
            </p>

            {/* Additional Projects */}
            <div className="space-y-6 mb-12">
              {additionalProjects.map((project, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left p-6 h-auto bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => window.open(project.link, "_blank")}
                >
                  <div>
                    <div className="text-lg font-semibold mb-2">
                      {project.title} ↗
                    </div>
                    <div className="text-gray-400 text-sm leading-relaxed">
                      {project.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Social Links */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    {link.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                © 2024 Your Name. Built with React, TypeScript, and
                TailwindCSS.
              </p>
              <p className="mt-2">
                This portfolio is open source and available on{" "}
                <a
                  href="https://github.com/yourusername/portfolio"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              </p>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">Behind the Scenes</h3>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-900 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-semibold">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">8+</div>
                  <div className="text-gray-400">Years Experience</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">50+</div>
                  <div className="text-gray-400">Projects Delivered</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">15+</div>
                  <div className="text-gray-400">Teams Led</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    100k+
                  </div>
                  <div className="text-gray-400">Users Impacted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
