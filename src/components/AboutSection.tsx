import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const writings = [
    {
      title: "Building Scalable React Applications: A Comprehensive Guide",
      description: "Best practices for structuring large React applications",
      link: "#",
    },
    {
      title: "The Art of Code Reviews: Beyond Finding Bugs",
      description: "How to make code reviews a tool for team growth",
      link: "#",
    },
    {
      title: "From Junior to Senior: A Developer's Journey",
      description: "Lessons learned while growing as a software engineer",
      link: "#",
    },
    {
      title: "Remote Team Leadership in Tech",
      description: "Strategies for leading distributed engineering teams",
      link: "#",
    },
    {
      title: "The Future of Web Development",
      description: "Emerging trends and technologies to watch",
      link: "#",
    },
  ];

  const contactMethods = [
    {
      label: "Email",
      value: "your.email@example.com",
      action: () => window.open("mailto:your.email@example.com", "_blank"),
    },
    {
      label: "Phone",
      value: "(555) 123-4567",
      action: () => window.open("tel:+15551234567", "_blank"),
    },
    {
      label: "Location",
      value: "San Francisco, CA",
      action: null,
    },
    {
      label: "Resume",
      value: "Download Resume (PDF)",
      action: () => window.open("#", "_blank"),
    },
  ];

  const socialLinks = [
    { name: "LinkedIn", url: "https://linkedin.com/in/yourprofile" },
    { name: "GitHub", url: "https://github.com/yourusername" },
    { name: "Twitter", url: "https://twitter.com/yourusername" },
    { name: "Medium", url: "https://medium.com/@yourusername" },
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* About Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 leading-tight">
              About me
            </h2>

            <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-8">
              <p>
                I'm a software engineer by training, a leader by experience, and
                a lifelong learner by choice. With over 8 years in the tech
                industry, I've had the privilege of working on products that
                millions of people use daily.
              </p>

              <p>
                My journey started with a Computer Science degree, but what
                really shaped me was working alongside incredible teams at
                various startups and established companies. I learned that the
                best products come from the intersection of technical excellence
                and human understanding.
              </p>

              <p>
                When I'm not coding or mentoring, you'll find me exploring new
                technologies, contributing to open source projects, or sharing
                insights through writing and speaking at conferences.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Let's connect
              </h3>
              {contactMethods.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">{contact.label}</span>
                  {contact.action ? (
                    <button
                      onClick={contact.action}
                      className="text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {contact.value}
                    </button>
                  ) : (
                    <span className="text-gray-900">{contact.value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(social.url, "_blank")}
                >
                  {social.name} ↗
                </Button>
              ))}
            </div>
          </div>

          {/* Writings & Articles */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Recent Writings
            </h3>
            <div className="space-y-6">
              {writings.map((writing, index) => (
                <Card
                  key={index}
                  className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {writing.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {writing.description}
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Read article ↗
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                Speaking Engagements
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>React Conf 2024</span>
                  <span className="text-gray-500">Keynote Speaker</span>
                </div>
                <div className="flex justify-between">
                  <span>Tech Leadership Summit</span>
                  <span className="text-gray-500">Panel Discussion</span>
                </div>
                <div className="flex justify-between">
                  <span>Frontend Masters Podcast</span>
                  <span className="text-gray-500">Guest Interview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
