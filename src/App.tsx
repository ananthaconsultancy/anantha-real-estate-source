import { lazy, Suspense } from "react";
const PropertyAdmin = lazy(() => import("./pages/PropertyAdmin"));
const EnquiryAdmin = lazy(() => import("./pages/EnquiryAdmin"));
const DealAdmin = lazy(() => import("./pages/DealAdmin"));
const OperationsAdmin = lazy(() => import("./pages/OperationsAdmin"));
const CRMAdmin = lazy(() => import("./pages/CRMAdmin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const HomePageV2 = lazy(() => import("./pages/HomePageV2"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage"));
const PropertyCategoryPage = lazy(() => import("./pages/PropertyCategoryPage"));
const PropertyPage = lazy(() => import("./pages/PropertyPage"));
const PropertyIntelligencePage = lazy(() => import("./pages/PropertyIntelligencePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PropertyConsultationPage = lazy(() => import("./pages/PropertyConsultationPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CentralWorld = lazy(() => import("./pages/centralworld"));
const CommercialsPage = lazy(() => import("./pages/CommercialsPage"));
import ScrollToTop from "./components/ScrollToTop";
import AnalyticsPageView from "./components/AnalyticsPageView";
import { LeadEnquiryProvider } from "./components/LeadEnquiry";

const queryClient = new QueryClient();

const App = () => {
  const adminPath = window.location.pathname.replace(/\/$/, "");
  if (adminPath === "/admin/login") return <Suspense fallback={<p>Loading login…</p>}><AdminLogin /></Suspense>;
  if (adminPath === "/admin/operations") return <Suspense fallback={<p>Loading operations…</p>}><OperationsAdmin /></Suspense>;
  if (adminPath === "/admin/crm") return <Suspense fallback={<p>Loading CRM…</p>}><CRMAdmin /></Suspense>;
  if (adminPath === "/admin/deals") return <Suspense fallback={<p>Loading deal pipeline…</p>}><DealAdmin /></Suspense>;
  if (adminPath === "/admin/enquiries") return <Suspense fallback={<p>Loading enquiry operations…</p>}><EnquiryAdmin /></Suspense>;
  if (adminPath === "/admin/properties") return <Suspense fallback={<p>Loading property verification…</p>}><PropertyAdmin /></Suspense>;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LeadEnquiryProvider>
            <ScrollToTop />
            <AnalyticsPageView />
            <Suspense fallback={<main className="grid min-h-[50vh] place-items-center text-sm text-slate-500">Loading…</main>}>
              <Routes>
                <Route path="/" element={<HomePageV2 />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/commercials" element={<CommercialsPage />} />
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
            </Suspense>
          </LeadEnquiryProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
