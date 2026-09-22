import { lazy, Suspense } from "react";
const GBPAdmin = lazy(() => import("./pages/GBPAdmin"));
const PropertyAdmin = lazy(() => import("./pages/PropertyAdmin"));
const EnquiryAdmin = lazy(() => import("./pages/EnquiryAdmin"));
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePageV2 from "./pages/HomePageV2";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyCategoryPage from "./pages/PropertyCategoryPage";
import PropertyPage from "./pages/PropertyPage";
import PropertyIntelligencePage from "./pages/PropertyIntelligencePage";
import ContactPage from "./pages/ContactPage";
import PropertyConsultationPage from "./pages/PropertyConsultationPage";
import NotFound from "./pages/NotFound";
import CentralWorld from "./pages/centralworld";
import ScrollToTop from "./components/ScrollToTop";
import AnalyticsPageView from "./components/AnalyticsPageView";

const queryClient = new QueryClient();

const App = () => {
  const adminPath = window.location.pathname.replace(/\/$/, "");
  if (adminPath === "/admin/gbp") {
    return (
      <Suspense fallback={<p>Loading admin…</p>}>
        <GBPAdmin />
      </Suspense>
    );
  }
  if (adminPath === "/admin/enquiries") {
    return <Suspense fallback={<p>Loading enquiry operations…</p>}><EnquiryAdmin /></Suspense>;
  }
  if (adminPath === "/admin/properties") {
    return (
      <Suspense fallback={<p>Loading property verification…</p>}>
        <PropertyAdmin />
      </Suspense>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AnalyticsPageView />
          <Routes>
            <Route path="/" element={<HomePageV2 />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:category" element={<PropertyCategoryPage />} />
            <Route path="/property/:slug" element={<PropertyPage />} />
            <Route path="/property-intelligence" element={<PropertyIntelligencePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/property-consultation" element={<PropertyConsultationPage />} />
            <Route path="/centralworld" element={<CentralWorld />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
