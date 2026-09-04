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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="eyebrow mb-3">// what i build</p>
            <h2 className="display-font text-4xl md:text-5xl font-bold tracking-tight">Useful by design.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Products that reduce friction, create momentum, and hold up when real people start using them.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {areas.map((area, i) => {
            const Icon = getIcon(area.icon_name || "cog");
            return (
              <motion.div key={area.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`glass-card glass-card-hover p-7 md:p-8 group ${i === 0 ? "lg:row-span-2 lg:min-h-[25rem]" : ""}`}>
                <div className="flex items-center justify-between mb-10">
                  <span className="mono-font text-[10px] text-primary">0{i + 1}</span>
                  <Icon className="w-5 h-5 text-primary group-hover:rotate-[-8deg] transition-transform" />
                </div>
                <h3 className="display-font font-bold text-xl mb-3 flex items-center gap-2">
                  {area.title}
                  <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{area.purpose}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(area.tech || []).map((t) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-1 rounded-full bg-secondary text-muted-foreground">{t}</span>
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
