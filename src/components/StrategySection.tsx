const StrategySection = () => {
  const workshops = [
    {
      title: "Technical Architecture Planning",
      description: "Martech system design and scalability workshops",
      image: "/placeholder.svg",
    },
    {
      title: "Product Roadmap Strategy",
      description: "Aligning technical decisions with business goals",
      image: "/placeholder.svg",
    },
    {
      title: "Team Process Optimization",
      description: "Agile methodologies and workflow improvements",
      image: "/placeholder.svg",
    },
    {
      title: "Technology Stack Evaluation",
      description: "Making informed decisions about tools and frameworks",
      image: "/placeholder.svg",
    },
    {
      title: "Risk Assessment & Mitigation",
      description: "Identifying and addressing technical and project risks",
      image: "/placeholder.svg",
    },
  ];

  return (
    <section id="strategy" className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16">
          <h2 className="text-8xl md:text-[12rem] font-light text-gray-800 leading-none mb-8">
            strategy
          </h2>
          <div className="max-w-4xl">
            <p className="text-2xl md:text-3xl text-yellow-400 leading-relaxed mb-8">
              Technology is a team sport. I help translate business vision into
              technical roadmaps that teams can execute effectively.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              Through structured workshops, strategic planning sessions, and
              hands-on collaboration, I bridge the gap between what needs to be
              built and how to build it sustainably.
            </p>
          </div>
        </div>

        {/* Workshop Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gray-800 rounded-lg overflow-hidden mb-4 aspect-video">
                <img
                  src={workshop.image}
                  alt={workshop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {workshop.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {workshop.description}
              </p>
            </div>
          ))}
        </div>

        {/* Strategy Process */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-900 font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Discover</h3>
            <p className="text-gray-300">
              Understand business objectives, technical constraints, and team
              capabilities
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-900 font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Design</h3>
            <p className="text-gray-300">
              Create technical architecture and implementation roadmaps
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-900 font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Deliver</h3>
            <p className="text-gray-300">
              Execute with clear milestones, metrics, and continuous feedback
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
