import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reels from "./pages/Reels";
import NotFound from "./pages/NotFound";
import { Projects } from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDetail from "./pages/ClientDetail";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectsProvider } from "./contexts/ProjectsContext";
import { ContactsProvider } from "./contexts/ContactsContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import AboutUs from "./pages/AboutUs";
import JoinUs from "./pages/JoinUs";
import Hiring from "./pages/Hiring";
import NeoTimeline from "./pages/NeoTimeline";
import NeoTimelineView from "./pages/NeoTimelineView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SiteSettingsProvider>
        <ProjectsProvider>
          <ContactsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/reels" element={<Reels />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/join-us" element={<JoinUs />} />
                  <Route path="/hiring" element={<Hiring />} />
                  <Route path="/neo-timeline" element={<NeoTimeline />} />
                  <Route path="/neo-timeline/view" element={<NeoTimelineView />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/client/:id" element={<ClientDetail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ContactsProvider>
        </ProjectsProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
