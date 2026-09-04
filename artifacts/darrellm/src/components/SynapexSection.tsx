import { motion } from "framer-motion";
import { Users, Code, Lightbulb, Rocket, CheckCircle2, Hammer, ArrowRight, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-data";

const pillars = [
  { icon: Code, title: "Real Projects", desc: "Learn by building production-grade software", color: "text-blue-400" },
  { icon: Users, title: "Collaboration", desc: "Work in teams like real dev environments", color: "text-purple-400" },
  { icon: Lightbulb, title: "Problem Solving", desc: "Tackle real-world challenges, not tutorials", color: "text-cyan-400" },
  { icon: Rocket, title: "Career Growth", desc: "From junior to job-ready senior developer", color: "text-emerald-400" },
];

const progress = [
  {
    icon: CheckCircle2,
    status: "Done",
    items: ["Core platform architecture", "Project matching system", "Mentorship framework"],
    color: "text-emerald-400",
    glow: "hsl(142 76% 36% / 0.15)",
  },
  {
    icon: Hammer,
    status: "Building",
    items: ["Collaboration tools", "Progress tracking", "Community features"],
    color: "text-blue-400",
    glow: "hsl(217 91% 65% / 0.12)",
  },
  {
    icon: ArrowRight,
    status: "Next",
    items: ["Public launch", "Enterprise partnerships", "Developer certifications"],
    color: "text-purple-400",
    glow: "hsl(270 60% 65% / 0.1)",
  },
];

const SynapexSection = () => {
  const { data: settings } = useSiteSettings();

  return (
    <section id="synapex" className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(217 91% 65% / 0.04), transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="section-label mb-3">// startup venture</p>

          <div className="flex items-center gap-4 mb-4">
            <img
              src="/synapex-logo.png"
              alt="Synapex"
              className="h-10 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">Synapex</h2>
          </div>

          <p className="text-muted-foreground text-sm max-w-lg mb-4 leading-relaxed">
            {settings?.synapex_tagline || "Where junior developers evolve into real builders."}
          </p>

          <a
            href="https://synapex.gleeze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors group"
          >
            synapex.gleeze.com
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
          style={{ boxShadow: "0 0 40px hsl(217 91% 65% / 0.06), 0 8px 32px hsl(225 20% 0% / 0.4), inset 0 1px 0 hsl(210 40% 100% / 0.08)" }}
        >
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {settings?.synapex_mission || "Synapex is a platform where tech-savvy juniors evolve into senior developers by building real projects, collaborating, and solving real problems — not just watching tutorials."}
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card glass-card-hover p-6"
            >
              <p.icon className={`w-5 h-5 ${p.color} mb-4`} />
              <h3 className="font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress columns */}
        <div className="grid md:grid-cols-3 gap-3">
          {progress.map((col, i) => (
            <motion.div
              key={col.status}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
              style={{ boxShadow: `0 0 32px ${col.glow}, 0 8px 24px hsl(225 20% 0% / 0.3), inset 0 1px 0 hsl(210 40% 100% / 0.06)` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <col.icon className={`w-4 h-4 ${col.color}`} />
                <h4 className={`font-mono text-xs uppercase tracking-wider ${col.color}`}>{col.status}</h4>
              </div>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground leading-relaxed">{item}</li>
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
