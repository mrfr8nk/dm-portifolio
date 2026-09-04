import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useWhatIBuild } from "@/hooks/use-site-data";
import { getIcon } from "@/lib/icons";

const WhatIBuildSection = () => {
  const { data: areas } = useWhatIBuild();

  if (!areas?.length) return null;

  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// what i build</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Real systems for real problems</h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {areas.map((area, i) => {
            const Icon = getIcon(area.icon_name || "cog");
            return (
              <motion.div key={area.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background p-8 group hover:bg-card transition-colors">
                <Icon className="w-5 h-5 text-muted-foreground mb-6 group-hover:text-foreground transition-colors" />
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  {area.title}
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{area.purpose}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(area.tech || []).map((t) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">{area.impact}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatIBuildSection;
