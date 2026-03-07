import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProposalSection {
  title: string;
  content: string;
}

interface ProposalData {
  title: string;
  client: string;
  date: string;
  status: string;
  redirect?: string;
  sections: ProposalSection[];
}

const ProposalView = () => {
  const { code } = useParams<{ code: string }>();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/proposals/data/${code}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (data.redirect) {
          if (window.gtag) window.gtag("event", "proposal_redirect", { code, destination: data.redirect });
          window.location.href = data.redirect;
          return;
        }
        if (window.gtag) window.gtag("event", "proposal_view", { code, title: data.title });
        setProposal(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-gray-400">Loading proposal...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20 px-6">
          <div className="text-center max-w-md">
            <h1 className="font-serif text-3xl font-medium text-charcoal mb-4">
              Proposal not found
            </h1>
            <p className="text-gray-500 mb-8">
              The code <span className="font-mono text-charcoal">{code}</span> doesn't
              match any active proposals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/proposals">
                <Button variant="outline">Try another code</Button>
              </Link>
              <a href="mailto:jon@jonathanlynshue.com">
                <Button className="bg-gold hover:bg-gold-dark text-white">
                  Contact me
                </Button>
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar TOC */}
            <aside className="lg:w-64 flex-shrink-0 no-print">
              <div className="lg:sticky lg:top-24">
                <div className="text-xs font-medium text-gold uppercase tracking-widest mb-4">
                  Table of Contents
                </div>
                <nav className="space-y-2">
                  {proposal.sections.map((section, index) => (
                    <a
                      key={index}
                      href={`#section-${index}`}
                      className="block text-sm text-gray-500 hover:text-charcoal transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
                <Separator className="my-6" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  Download PDF
                </Button>
              </div>
            </aside>

            {/* Proposal Content */}
            <article className="flex-1 min-w-0">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-gold uppercase tracking-widest">
                    Proposal
                  </span>
                  <span className="text-xs text-gray-400">{proposal.date}</span>
                  <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">
                    {proposal.status}
                  </span>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-medium text-charcoal mb-2">
                  {proposal.title}
                </h1>
                <p className="text-gray-500">Prepared for {proposal.client}</p>
              </div>

              <div className="space-y-12">
                {proposal.sections.map((section, index) => (
                  <div key={index} id={`section-${index}`}>
                    <h2 className="font-serif text-2xl font-semibold text-charcoal mb-6">
                      {section.title}
                    </h2>
                    <div className="prose prose-gray max-w-none prose-headings:font-serif prose-a:text-gold">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {section.content}
                      </ReactMarkdown>
                    </div>
                    {index < proposal.sections.length - 1 && (
                      <Separator className="mt-12" />
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-12" />
              <div className="text-center text-sm text-gray-400">
                <p>Prepared by Jonathan Lyn-Shue</p>
                <p>jon@jonathanlynshue.com</p>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProposalView;
