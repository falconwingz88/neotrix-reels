import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { AdminRoute } from "@/components/AdminRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContactsProvider } from "@/contexts/ContactsContext";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { ArticlesProvider } from "@/contexts/ArticlesContext";
const Index = lazy(() => import("@/pages/Index"));
const Reels = lazy(() => import("@/pages/Reels"));
const Projects = lazy(() => import("@/pages/Projects").then((module) => ({ default: module.Projects })));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));
const JoinUs = lazy(() => import("@/pages/JoinUs"));
const Hiring = lazy(() => import("@/pages/Hiring"));
const Articles = lazy(() => import("@/pages/Articles"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const Login = lazy(() => import("@/pages/Login"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const ClientDetail = lazy(() => import("@/pages/ClientDetail"));
const NeoTimeline = lazy(() => import("@/pages/NeoTimeline"));
const NeoTimelineView = lazy(() => import("@/pages/NeoTimelineView"));
const RestrictedProjects = lazy(() => import("@/pages/RestrictedProjects"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const App = () => (
  <AuthProvider>
    <SiteSettingsProvider>
      <ArticlesProvider>
        <ProjectsProvider>
          <ContactsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#0A0B0C] text-sm text-white/50">Loading Neotrix…</div>}>
                  <Routes>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/reels" element={<Reels />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/join-us" element={<JoinUs />} />
                    <Route path="/hiring" element={<Hiring />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/articles/:slug" element={<ArticleDetail />} />
                  </Route>
                  <Route path="/neo-timeline" element={<NeoTimeline />} />
                  <Route path="/neo-timeline/view" element={<NeoTimelineView />} />
                  <Route path="/r" element={<AdminRoute><RestrictedProjects /></AdminRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/client/:id" element={<AdminRoute><ClientDetail /></AdminRoute>} />
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
          </ContactsProvider>
        </ProjectsProvider>
      </ArticlesProvider>
    </SiteSettingsProvider>
  </AuthProvider>
);

export default App;
