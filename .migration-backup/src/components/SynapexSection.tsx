import { motion } from "framer-motion";
import { Users, Code, Lightbulb, Rocket, CheckCircle2, Hammer, ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-data";

const pillars = [
  { icon: Code, title: "Real Projects", desc: "Learn by building production-grade software" },
  { icon: Users, title: "Collaboration", desc: "Work in teams like real dev environments" },
  { icon: Lightbulb, title: "Problem Solving", desc: "Tackle real-world challenges, not tutorials" },
  { icon: Rocket, title: "Career Growth", desc: "From junior to job-ready senior developer" },
];

const progress = [
  { icon: CheckCircle2, status: "Done", items: ["Core platform architecture", "Project matching system", "Mentorship framework"], color: "text-foreground" },
  { icon: Hammer, status: "Building", items: ["Collaboration tools", "Progress tracking", "Community features"], color: "text-muted-foreground" },
  { icon: ArrowRight, status: "Next", items: ["Public launch", "Enterprise partnerships", "Developer certifications"], color: "text-muted-foreground/50" },
];

const SynapexSection = () => {
  const { data: settings } = useSiteSettings();

  return (
    <section id="synapex" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// startup</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Synapex</h2>
          <p className="text-muted-foreground text-sm max-w-lg mb-2">
            {settings?.synapex_tagline || "Where junior developers evolve into real builders."}
          </p>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-border rounded-lg p-8 mb-12">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {settings?.synapex_mission || "Synapex is a platform where tech-savvy juniors evolve into senior developers by building real projects, collaborating, and solving real problems."}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-12">
          {pillars.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-background p-6">
              <p.icon className="w-4 h-4 text-muted-foreground mb-4" />
              <h3 className="font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {progress.map((col, i) => (
            <motion.div key={col.status} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background p-6">
              <div className="flex items-center gap-2 mb-4">
                <col.icon className={`w-4 h-4 ${col.color}`} />
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{col.status}</h4>
              </div>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SynapexSection;
