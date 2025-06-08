const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-8">
            Hi, I'm <span className="font-medium">Jonathan Lyn-Shue</span>,
            <br />
            <span className="text-gray-700">
              Accelerating business transformation and leading teams to create
              innovative data products that make a difference.
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <button
              onClick={() => scrollToSection("work")}
              className="block text-left text-lg text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span className="bg-yellow-200 px-1">Work</span> Projects & Case
              Studies
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                ↓
              </span>
            </button>
            <button
              onClick={() => scrollToSection("leadership")}
              className="block text-left text-lg text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span className="bg-yellow-200 px-1">Leadership</span>: Training &
              mentorship
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                ↓
              </span>
            </button>
            <button
              onClick={() => scrollToSection("strategy")}
              className="block text-left text-lg text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span className="bg-yellow-200 px-1">Strategy</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                ↓
              </span>
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => scrollToSection("collaboration")}
              className="block text-left text-lg text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span className="bg-yellow-200 px-1">Collaboration</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                ↓
              </span>
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block text-left text-lg text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span className="bg-yellow-200 px-1">About me</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                ↓
              </span>
            </button>
            <button
              onClick={() => scrollToSection("more")}
              className="block text-left text-lg text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span className="bg-yellow-200 px-1">There's more</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                ↓
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
