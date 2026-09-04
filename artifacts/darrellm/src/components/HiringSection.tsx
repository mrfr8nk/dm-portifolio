import { ArrowUpRight, BriefcaseBusiness, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-data";

const HiringSection = () => {
  const { data: settings } = useSiteSettings();
  if (settings?.hiring_enabled === "false") return null;

  return (
    <section id="hiring" className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="hiring-panel"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-primary mb-5">
            <BriefcaseBusiness className="w-4 h-4" />
            <span className="eyebrow">open to the right project</span>
          </div>
          <h2 className="display-font text-3xl md:text-5xl font-bold tracking-tight leading-[1.04]">
            {settings?.hiring_headline || "Need a developer who can take a product from rough idea to reliable release?"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mt-5 max-w-xl">
            {settings?.hiring_copy || "I help product-minded teams turn unclear problems into useful, maintainable software."}
          </p>
        </div>
        <div className="hiring-action">
          <p className="text-xs text-muted-foreground mono-font flex items-start gap-2 mb-5">
            <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            {settings?.hiring_fit || "Best fit: teams with a real problem to solve."}
          </p>
          <a href="#contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:translate-y-[-2px] transition-transform pressable">
            {settings?.hiring_cta || "Start a conversation"}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default HiringSection;