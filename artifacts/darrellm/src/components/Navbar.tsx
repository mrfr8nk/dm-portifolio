import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import dmLogo from "@/assets/dm-logo.png";
import { motionDuration, motionEase } from "@/lib/motion";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Synapex", href: "#synapex" },
  { label: "Journey", href: "#journey" },
  { label: "Education", href: "#education" },
  { label: "Certs", href: "#certifications" },
  { label: "Blog", href: "#blog" },
  { label: "Devlogs", href: "#devlogs" },
  { label: "Friends", href: "#friends" },
  { label: "Connect", href: "#connect" },
  { label: "Hire me", href: "#hiring" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(window.scrollY > 32);
        setScrollProgress(scrollableHeight > 0 ? Math.min(100, (window.scrollY / scrollableHeight) * 100) : 0);
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-32% 0px -58% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );
    const observed = new Set<Element>();
    const observeMountedSections = () => {
      const sectionIds = ["top", ...navItems.map((item) => item.href.slice(1))];
      sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section))
        .forEach((section) => {
          if (observed.has(section)) return;
          observed.add(section);
          observer.observe(section);
        });
    };
    const mutationObserver = new MutationObserver(observeMountedSections);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    observeMountedSections();
    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;
    const id = location.hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const goTo = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate(`/${href}`);
      return;
    }

    const id = href.slice(1);
    if (id === "top") {
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(id);
    if (target) {
      window.history.replaceState(null, "", href);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: motionDuration.section, ease: motionEase }}
      className={`nav-shell fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "is-scrolled bg-background/88 backdrop-blur-xl border-b border-border"
          : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <span className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-[4.5rem]">
        <a href={location.pathname === "/" ? "#top" : "/"} onClick={(event) => goTo("#top", event)} data-testid="link-home" className="flex items-center gap-3 group" aria-label="Darrell Mucheri home">
          <img src={dmLogo} alt="Darrell Mucheri logo" className="w-9 h-9 rounded-full object-cover bg-card border border-border group-hover:rotate-[-8deg] transition-transform" />
          <span className="font-mono font-bold text-sm hidden sm:inline tracking-tight">
            darrell<span className="text-primary">.</span>dev
          </span>
        </a>

        <div className="hidden xl:flex items-center gap-5 2xl:gap-7">
          {navItems.map((item) => (
            <a
              key={item.label}
               href={location.pathname === "/" ? item.href : `/${item.href}`}
               onClick={(event) => goTo(item.href, event)}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
              aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
              className={`nav-link text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.16em] ${activeSection === item.href.slice(1) ? "is-active text-foreground" : ""}`}
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
          <a
             href={location.pathname === "/" ? "#contact" : "/#contact"}
             onClick={(event) => goTo("#contact", event)}
            data-testid="link-navbar-contact"
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:translate-y-[-2px] transition-transform pressable"
          >
            Let's talk <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="xl:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
            className="p-2 text-foreground focus-ring"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: motionDuration.normal, ease: motionEase }}
            id="mobile-navigation"
             className="xl:hidden bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                   href={location.pathname === "/" ? item.href : `/${item.href}`}
                  data-testid={`link-mobile-${item.label.toLowerCase()}`}
                   onClick={(event) => goTo(item.href, event)}
                  aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
                  className={`mobile-nav-link text-muted-foreground hover:text-foreground transition-colors py-2.5 text-sm font-mono ${activeSection === item.href.slice(1) ? "is-active text-foreground" : ""}`}
                >
                  {item.label}
                </a>
              ))}
              <a
                 href={location.pathname === "/" ? "#contact" : "/#contact"}
                 onClick={(event) => goTo("#contact", event)}
                data-testid="link-mobile-contact"
                className="mt-2 text-sm font-bold px-4 py-3 rounded-full bg-primary text-primary-foreground text-center pressable"
              >
                Let's Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
