import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Proposals = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      if (window.gtag) window.gtag("event", "proposal_code_submitted", { code: code.trim().toLowerCase() });
      navigate(`/proposals/${code.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <Card className="w-full max-w-md shadow-lg border-t-4 border-t-gold">
          <CardContent className="p-8">
            <h1 className="font-serif text-2xl font-semibold text-charcoal mb-2 text-center">
              Proposals Portal
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Enter the access code provided with your proposal.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter proposal code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg py-6 tracking-widest uppercase"
                autoFocus
              />
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-white py-6 text-lg"
                disabled={!code.trim()}
              >
                View Proposal
              </Button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-6">
              Don't have a code?{" "}
              <a
                href="mailto:jon@jonathanlynshue.com"
                className="text-gold hover:text-gold-dark"
              >
                Contact me
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Proposals;
