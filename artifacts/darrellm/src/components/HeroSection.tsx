import { useEffect, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Download, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-data";
import profileImg from "@/assets/profile-hero.jpg";

const taglines = [
  "Full Stack Developer",
  "WhatsApp Bot Builder",
  "Startup Founder",
  "System Architect",
];

const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const [tagIndex, setTagIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), { stiffness: 170, damping: 20 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), { stiffness: 170, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(taglines[0]);
      setTyping(false);
      return;
    }
    const target = taglines[tagIndex];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(t);
      } else {
        setTagIndex((i) => (i + 1) % taglines.length);
        setTyping(true);
        return undefined;
      }
    }
  }, [displayed, typing, tagIndex, shouldReduceMotion]);

  const name = settings?.name || "Darrell Mucheri";
  const [firstName, ...rest] = name.split(" ");
  const profileSrc = settings?.profile_image_url || profileImg;
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || shouldReduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };
  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section id="top" className="relative min-h-[92dvh] flex items-center px-5 md:px-10 lg:px-16 pt-28 pb-16 overflow-hidden">
      <div className="absolute right-[-5rem] top-24 h-64 w-64 rounded-full border border-primary/20 md:h-96 md:w-96" aria-hidden="true" />
      <div className="absolute right-8 top-44 h-3 w-3 rounded-full bg-accent animate-pulse" aria-hidden="true" />
      <div className="hero-grid absolute right-0 top-0 h-[38rem] w-[42rem] opacity-80 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-stage order-first lg:order-last flex justify-center lg:justify-end"
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
          >
            <motion.div
              className="relative w-full max-w-[28rem]"
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
              initial={{ rotate: 2 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="absolute -inset-7 rounded-[2.5rem] border border-accent/35"
                 animate={shouldReduceMotion ? undefined : { rotate: [2, -1, 2], scale: [0.98, 1, 0.98] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <div className="absolute -inset-3 rounded-[2rem] border border-primary/20 rotate-3" aria-hidden="true" />
               <div className="hero-frame liquid-hero-frame relative aspect-[0.86] rounded-[1.75rem] overflow-hidden border border-border bg-secondary shadow-2xl shadow-primary/10">
                <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-multiply" aria-hidden="true" />
                 <motion.img
                  src={profileSrc}
                  alt={name}
                   loading="eager"
                  className="w-full h-full object-cover grayscale-[0.35] hover:grayscale-0 transition-all duration-700"
                  style={{ scale: 1.04, translateZ: 18 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-transparent to-transparent z-10" />
                <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between text-background z-20">
                  <div>
                    <p className="mono-font text-[10px] uppercase tracking-[0.2em] opacity-75 mb-1">currently online</p>
                    <p className="display-font text-lg">{name}</p>
                  </div>
                  <span className="h-3 w-3 rounded-full bg-accent border-2 border-background" />
                </div>
              </div>
               <div className="glass-badge absolute -left-5 top-8 bg-card border border-border rounded-full px-3 py-2 shadow-sm">
                <span className="mono-font text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <span className="text-primary">/</span> profile / 01
                </span>
              </div>
               <div className="glass-badge absolute -right-4 bottom-10 bg-background/80 backdrop-blur border border-border rounded-full px-3 py-2 shadow-sm">
                <span className="mono-font text-[10px] uppercase tracking-[0.12em] text-muted-foreground">move to explore</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="eyebrow mb-7">
              {settings?.hero_greeting_prefix || "~/darrell-mucheri"}
            </p>
            <h1 className="display-font text-[3.55rem] sm:text-6xl md:text-7xl lg:text-[6.6rem] font-bold leading-[0.91] mb-7 tracking-[-0.07em]">
              {firstName}<br /><span className="text-primary">{rest.join(" ")}</span><span className="text-accent">.</span>
            </h1>
            <div className="h-8 mb-6 flex items-center">
              <span className="mono-font text-xs md:text-sm text-muted-foreground">
                <span className="text-primary">01</span>&nbsp; / &nbsp;{displayed}<span className="text-primary animate-pulse">_</span>
              </span>
            </div>
            <p className="text-foreground/75 text-base md:text-lg max-w-xl mb-9 leading-relaxed">
              {settings?.tagline || "Started coding at 13. Now building systems, tools, and a developer ecosystem that solves real problems."}
            </p>
            <div className="flex flex-wrap gap-3">
               <a href="#projects" data-testid="link-hero-projects" className="liquid-button liquid-button-primary inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:translate-y-[-2px] transition-transform shadow-lg shadow-primary/15">
                View Projects <ArrowRight className="w-4 h-4" />
              </a>
               <a href="#contact" data-testid="link-hero-contact" className="liquid-button inline-flex items-center gap-2 px-5 py-3 border border-border text-foreground font-bold text-sm rounded-full hover:bg-accent transition-colors">
                <Mail className="w-4 h-4" /> Contact
              </a>
               <a href={settings?.cv_url || "#"} data-testid="link-hero-cv" className="liquid-button inline-flex items-center gap-2 px-5 py-3 border border-border text-muted-foreground font-bold text-sm rounded-full hover:bg-accent hover:text-foreground transition-colors">
                <Download className="w-4 h-4" /> CV
              </a>
            </div>
            <a href="#about" data-testid="link-scroll-about" className="inline-flex items-center gap-2 mt-16 mono-font text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
              Scroll to explore <ArrowDown className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
