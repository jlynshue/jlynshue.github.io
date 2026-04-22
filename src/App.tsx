import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import { gb, GrowthBookProvider, initGrowthBook, growthBookEnabled } from "@/lib/growthbook";
import Index from "./pages/Index";
import Sprint from "./pages/Sprint";
import Diagnostic from "./pages/Diagnostic";
import NotFound from "./pages/NotFound";

initGrowthBook();

const queryClient = new QueryClient();

const AppRoutes = () => {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sprint" element={<Sprint />} />
      <Route path="/diagnostic" element={<Diagnostic />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppShell = ({ children }: { children: React.ReactNode }) => {
  if (growthBookEnabled && gb) {
    return <GrowthBookProvider growthbook={gb}>{children}</GrowthBookProvider>;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppShell>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppShell>
  </QueryClientProvider>
);

export default App;
