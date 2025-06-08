import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WorkSection = () => {
  return (
    <section id="work" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-16">
          <h2 className="text-8xl md:text-[12rem] font-light text-gray-200 leading-none">
            work
          </h2>
        </div>

        {/* Project 1 */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Scaling E-commerce Platform
              </h3>
              <Badge variant="secondary" className="mb-4">
                Full-Stack Development
              </Badge>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Led the development of a scalable e-commerce platform that
                handles over 10,000 daily transactions. Implemented
                microservices architecture with React frontend and Node.js
                backend.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  40% increase in conversion rate
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  99.9% uptime achieved
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  50% reduction in page load times
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
              <img
                src="/placeholder.svg"
                alt="E-commerce Platform Demo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Project 2 */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Real-time Collaboration Tool
              </h3>
              <Badge variant="secondary" className="mb-4">
                Frontend Development
              </Badge>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Built a real-time collaboration platform using React and
                WebSocket technology. Supports simultaneous editing, live
                cursors, and instant messaging for distributed teams.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">5k+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">99%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">20ms</div>
                    <div className="text-sm text-gray-600">Latency</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="lg:order-1 bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
              <img
                src="/placeholder.svg"
                alt="Collaboration Tool Demo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Project 3 - Special Background */}
        <div className="bg-blue-100 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                AI-Powered Analytics Dashboard
              </h3>
              <Badge variant="default" className="mb-4 bg-blue-600">
                0→1 Product Development
              </Badge>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Created an innovative analytics platform that uses machine
                learning to provide actionable insights from complex datasets.
                Features predictive analytics and automated report generation.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Machine learning integration for predictive insights
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Real-time data visualization with D3.js
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Automated reporting system
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700 font-medium">
                    Outcome: 80% faster decision-making for 1000+ users
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg aspect-video flex items-center justify-center shadow-lg">
              <img
                src="/placeholder.svg"
                alt="Analytics Dashboard"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
