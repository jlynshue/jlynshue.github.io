import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LeadershipSection = () => {
  const highlights = [
    "Led cross-functional teams of 15+ data analysts, scientists and engineers",
    "Mentored 30+ junior professionals through structured programs",
    "Established data strategy and governance best practices adopted company-wide",
    "Organized weekly tech talks and knowledge sharing sessions",
    "Implemented review processes that improved quality by 60%",
    "Created onboarding programs that reduced ramp-up time by 40%",
  ];

  return (
    <section id="leadership" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
            Building teams is just as important as building products.
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            I find deep meaning in helping others grow, sharing knowledge, and
            creating environments where everyone can do their best work.
          </p>

          <Button
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white"
            onClick={() =>
              window.open("mailto:your.email@example.com", "_blank")
            }
          >
            Schedule a mentoring call ↗
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center p-8">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Developers mentored</div>
            </CardContent>
          </Card>

          <Card className="text-center p-8">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600">Teams led</div>
            </CardContent>
          </Card>

          <Card className="text-center p-8">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-gray-900 mb-2">200+</div>
              <div className="text-gray-600">Training sessions delivered</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Leadership Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 leading-relaxed">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Speaking & Training
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-4">
              <h4 className="font-medium text-gray-900">
                Tech Conference Speaker
              </h4>
              <p className="text-gray-600">
                Regular speaker at developer conferences on topics of team
                leadership and technical architecture
              </p>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <h4 className="font-medium text-gray-900">Corporate Training</h4>
              <p className="text-gray-600">
                Delivered custom training programs for engineering teams
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
