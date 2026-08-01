import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import WallpaperLayout from "@/components/WallpaperLayout";
import Index from "./pages/Index";
import Sprint from "./pages/Sprint";
import Diagnostic from "./pages/Diagnostic";
import NotFound from "./pages/NotFound";
import Redesign from "./pages/Redesign";
import Work from "./pages/Work";
import Writing from "./pages/Writing";
import Lab from "./pages/Lab";
import Chat from "./pages/Chat";
import About from "./pages/About";
import ToolkitStub from "./pages/toolkit/ToolkitStub";

const queryClient = new QueryClient();

export const AppRoutes = () => {
  usePageTracking();

  return (
    <Routes>
      {/* Brand pages inside WallpaperLayout */}
      <Route element={<WallpaperLayout />}>
        <Route path="/" element={<Redesign />} />
        <Route path="/work" element={<Work />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* Offer pages outside WallpaperLayout — these use Header/Footer directly.
          react-router v6 matches by ranked specificity, not declaration order, so
          these resolve ahead of the "*" above despite being declared after it.
          Do not "fix" that by reordering. */}
      <Route path="/v1" element={<Index />} />
      <Route path="/sprint" element={<Sprint />} />
      <Route path="/diagnostic" element={<Diagnostic />} />
      <Route path="/toolkit/:slug" element={<ToolkitStub />} />
    </Routes>
  );
};

/**
 * Provider stack shared by the browser entry and the build-time prerenderer.
 *
 * Both entries wrap `AppRoutes` in this exact component, so the markup a
 * crawler receives comes from the same tree a visitor renders. Only the router
 * differs — BrowserRouter here, StaticRouter in entry-server.tsx. Keeping the
 * nesting in one place is what makes the prerendered text trustworthy rather
 * than a hand-maintained copy that can drift from the page.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {children}
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
);

export default App;
