import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import mockHackathon from "@/content/mock-hackathon-2026.json";
import EventsSection from "./components/EventsSection";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { getPageSeo } from "@/lib/site-seo";

const queryClient = new QueryClient();

const PageMetadata = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const { page, canonical, meta, schema } = getPageSeo(pathname);
    document.title = page.title;
    document.querySelectorAll("[data-site-seo]").forEach(node => node.remove());
    for (const [attribute, name, value] of meta) {
      const tag = document.createElement("meta");
      tag.setAttribute(attribute, name);
      tag.content = value;
      tag.setAttribute("data-site-seo", "");
      document.head.append(tag);
    }
    if (canonical) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonical;
      link.setAttribute("data-site-seo", "");
      document.head.append(link);
    }
    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      script.setAttribute("data-site-seo", "");
      document.head.append(script);
    }
  }, [pathname]);
  return null;
};

/* Scroll handler for hash links */
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

const App = () => {
  const [isDark, setIsDark] = useState(() => typeof document === "undefined" || !document.documentElement.classList.contains("light"));

  const toggleTheme = (button: HTMLButtonElement) => {
    const root = document.documentElement;
    if (root.hasAttribute("data-theme-transition")) return;

    const applyTheme = () => {
      root.classList.toggle("light", isDark);
      root.classList.toggle("dark", !isDark);
      setIsDark(!isDark);
      try {
        localStorage.setItem("theme", isDark ? "light" : "dark");
      } catch {
        // The selected theme still applies to the current page.
      }
    };

    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme();
      return;
    }

    const bounds = button.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.ceil(Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    ));

    root.style.setProperty("--theme-origin-x", `${x}px`);
    root.style.setProperty("--theme-origin-y", `${y}px`);
    root.style.setProperty("--theme-radius", `${radius}px`);
    root.setAttribute("data-theme-transition", "");

    const transition = document.startViewTransition(() => flushSync(applyTheme));
    const cleanup = () => {
      root.removeAttribute("data-theme-transition");
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
      root.style.removeProperty("--theme-radius");
    };
    void transition.finished.then(cleanup, cleanup);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <>
          <PageMetadata />
          <ScrollToTop />
          <ScrollToHash />
          {typeof window !== "undefined" && <><Analytics /><SpeedInsights /></>}
          <div className="relative min-h-screen">
            {/* Global Navigation */}
            <Navigation onThemeToggle={toggleTheme} isDark={isDark} />

            <main className="pt-24">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/events" element={<EventsSection />} />
                <Route path={mockHackathon.path} element={<Navigate to="/events" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
