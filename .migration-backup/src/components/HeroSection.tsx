import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
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

  useEffect(() => {
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
      }
    }
  }, [displayed, typing, tagIndex]);

  const name = settings?.name || "Darrell Mucheri";
  const [firstName, ...rest] = name.split(" ");
  const profileSrc = settings?.profile_image_url || profileImg;

  return (
    <section className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-20 pb-12">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="order-first lg:order-last flex justify-center"
          >
            <div className="relative">
              <div className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-border">
                <img src={profileSrc} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-background border border-border rounded-full px-3 py-1.5">
                <span className="font-mono text-xs text-muted-foreground">online</span>
                <span className="inline-block w-1.5 h-1.5 bg-foreground rounded-full ml-1.5 animate-pulse" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="font-mono text-xs text-muted-foreground mb-6 tracking-widest uppercase">
              {settings?.hero_greeting_prefix || "~/darrell-mucheri"}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-4 tracking-tight">
              {firstName}<br />{rest.join(" ")}<span className="text-muted-foreground">.</span>
            </h1>
            <div className="h-8 mb-6 flex items-center">
              <span className="font-mono text-sm md:text-base text-muted-foreground">
                {">"} {displayed}<span className="text-foreground animate-pulse">_</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mb-8 leading-relaxed">
              {settings?.tagline || "Started coding at 13. Now building systems, tools, and a developer ecosystem that solves real problems."}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium text-sm rounded-md hover:bg-foreground/90 transition-colors">
                View Projects <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground font-medium text-sm rounded-md hover:bg-accent transition-colors">
                <Mail className="w-4 h-4" /> Contact
              </a>
              <a href={settings?.cv_url || "#"} className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted-foreground font-medium text-sm rounded-md hover:bg-accent hover:text-foreground transition-colors">
                <Download className="w-4 h-4" /> CV
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
