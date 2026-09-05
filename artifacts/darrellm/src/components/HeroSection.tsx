import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Download, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-data";
import profileImg from "@/assets/profile-hero.jpg";

const roleLines = ["A software dev", "AI engineer", "Physics lover"];

const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const [tagIndex, setTagIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), { stiffness: 170, damping: 20 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), { stiffness: 170, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = window.setInterval(() => setTagIndex((index) => (index + 1) % roleLines.length), 2600);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion]);

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
            <motion.p
              className="eyebrow mb-5 hero-hello"
              initial={{ opacity: 0, y: 12, rotateX: -55 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Hey there, I&apos;m
            </motion.p>
            <p className="eyebrow mb-7 text-muted-foreground">
              {settings?.hero_greeting_prefix || "~/darrell-mucheri"}
            </p>
            <motion.h1
              className="display-font text-[3.55rem] sm:text-6xl md:text-7xl lg:text-[6.6rem] font-bold leading-[0.91] mb-7 tracking-[-0.07em]"
              initial={{ opacity: 0, y: 24, rotateX: -35 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 900 }}
            >
              {firstName}<br /><span className="text-primary">{rest.join(" ")}</span><span className="text-accent">.</span>
            </motion.h1>
            <div className="hero-role-scene h-12 mb-5 flex items-center" aria-live="polite">
              <span className="mono-font text-xs md:text-sm text-muted-foreground">
                <span className="text-primary">01</span>&nbsp; / &nbsp;
              </span>
              <AnimatePresence mode="wait" initial={!shouldReduceMotion}>
                <motion.span
                  key={shouldReduceMotion ? roleLines[0] : roleLines[tagIndex]}
                  className="hero-role-line mono-font text-xs md:text-sm text-foreground"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18, rotateX: -70, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18, rotateX: 70, filter: "blur(5px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformPerspective: 700 }}
                >
                  {roleLines[shouldReduceMotion ? 0 : tagIndex]}
                </motion.span>
              </AnimatePresence>
              <span className="text-primary animate-pulse ml-1">_</span>
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
