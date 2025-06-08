import { Card, CardContent } from "@/components/ui/card";

const CollaborationSection = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Product Manager",
      content:
        "Working with them is incredibly smooth. They have this amazing ability to translate complex technical concepts into language that everyone can understand. The collaboration feels effortless.",
      company: "TechCorp",
    },
    {
      name: "Michael R.",
      role: "Senior Developer",
      content:
        "One of the most collaborative engineers I've worked with. They're never defensive about feedback and always approach discussions with genuine curiosity and openness.",
      company: "StartupXYZ",
    },
    {
      name: "Lisa K.",
      role: "Design Lead",
      content:
        "They bring a unique perspective that bridges design and engineering beautifully. Our team dynamics improved significantly when they joined our project.",
      company: "DesignStudio",
    },
    {
      name: "David T.",
      role: "Engineering Manager",
      content:
        "Exceptional at fostering team collaboration. They helped establish processes that not only improved our code quality but also made our daily work more enjoyable.",
      company: "BigTech Inc",
    },
  ];

  const processImages = [
    {
      title: "Cross-functional Workshops",
      description:
        "Facilitating alignment between design, engineering, and product teams",
      image: "/placeholder.svg",
    },
    {
      title: "Code Review Excellence",
      description:
        "Establishing review processes that improve quality while maintaining team morale",
      image: "/placeholder.svg",
    },
  ];

  return (
    <section id="collaboration" className="py-16 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
            Great products come from great collaboration.
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
            Effective communication and empathy are at the core of successful
            teams. I believe in creating environments where everyone feels
            heard, valued, and empowered to contribute their best work.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {processImages.map((item, index) => (
            <div key={index} className="space-y-6">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Collaboration Principles */}
        <div className="mt-16 bg-white rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Collaboration Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Inclusive Communication
              </h4>
              <p className="text-gray-600 text-sm">
                Everyone's voice matters. Creating space for all team members to
                contribute.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Continuous Learning
              </h4>
              <p className="text-gray-600 text-sm">
                Embracing feedback and treating every interaction as a learning
                opportunity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Rapid Iteration
              </h4>
              <p className="text-gray-600 text-sm">
                Fast feedback loops and iterative improvement for better
                outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
