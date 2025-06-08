import { Card, CardContent } from "@/components/ui/card";

const ProjectShowcase = () => {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with React, Node.js, and Stripe integration",
      image: "/placeholder.svg",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "Collaborative project management tool with real-time updates",
      image: "/placeholder.svg",
      tech: ["React", "TypeScript", "Socket.io", "PostgreSQL"],
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      description: "Data visualization dashboard for business intelligence",
      image: "/placeholder.svg",
      tech: ["React", "D3.js", "Python", "FastAPI"],
    },
    {
      id: 4,
      title: "Mobile App",
      description: "Cross-platform mobile application with React Native",
      image: "/placeholder.svg",
      tech: ["React Native", "Expo", "Firebase", "Redux"],
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex-shrink-0 w-80 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
