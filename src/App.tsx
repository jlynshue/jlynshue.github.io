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

const queryClient = new QueryClient();

const AppRoutes = () => {
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
      {/* Legacy pages outside WallpaperLayout */}
      <Route path="/v1" element={<Index />} />
      <Route path="/sprint" element={<Sprint />} />
      <Route path="/diagnostic" element={<Diagnostic />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
