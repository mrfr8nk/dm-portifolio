import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Target, Brain, Wrench, Zap, CheckCircle2, TrendingUp, ExternalLink, Github } from "lucide-react";
import { useProjects } from "@/hooks/use-site-data";
import { getIcon } from "@/lib/icons";
import { TechIcon } from "@/lib/tech-icons";

const caseStudyFields = [
  { key: "problem", label: "Problem", icon: Target },
  { key: "thought", label: "Thought Process", icon: Brain },
  { key: "techReason", label: "Tech Choices", icon: Wrench },
  { key: "challenges", label: "Challenges", icon: Zap },
  { key: "solution", label: "Solution", icon: CheckCircle2 },
  { key: "result", label: "Result", icon: TrendingUp },
];

const ProjectsSection = () => {
  const { data: projects } = useProjects({ onlyVisible: true });
  const [openCase, setOpenCase] = useState<number | null>(null);

  if (!projects?.length) return null;

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// projects</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Work</h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <div className="space-y-4">
          {projects.map((p, i) => {
            const Icon = getIcon(p.icon_name || "bot");
            const cs = (p.case_study || {}) as Record<string, string>;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="border border-border rounded-lg hover:border-foreground/20 transition-colors overflow-hidden">
                  {p.image_url && (
                    <div className="aspect-[16/7] overflow-hidden bg-secondary border-b border-border">
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.description}</p>
                        {p.impact && <p className="text-xs font-mono text-muted-foreground mb-4">{p.impact}</p>}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(p.tech || []).map((t) => (
                            <span key={t} className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground">
                              <TechIcon name={t} className="w-3 h-3" />
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {(p as any).demo_url && (
                            <a href={(p as any).demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors">
                              <ExternalLink className="w-3 h-3" /> Live Demo
                            </a>
                          )}
                          {(p as any).source_url && (
                            <a href={(p as any).source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-secondary transition-colors">
                              <Github className="w-3 h-3" /> Source
                            </a>
                          )}
                          {Object.keys(cs).filter((k) => cs[k]).length > 0 && (
                            <button onClick={() => setOpenCase(openCase === i ? null : i)} className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors ml-1">
                              {openCase === i ? "hide" : "view"} case study
                              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openCase === i ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {openCase === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-6 md:px-8 pb-8 pt-2 border-t border-border">
                          <div className="grid sm:grid-cols-2 gap-6 mt-6">
                            {caseStudyFields.map((field) => cs[field.key] ? (
                              <div key={field.key} className="flex gap-3">
                                <field.icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-mono font-medium text-xs uppercase tracking-wider mb-1.5 text-muted-foreground">{field.label}</h4>
                                  <p className="text-foreground/80 text-sm leading-relaxed">{cs[field.key]}</p>
                                </div>
                              </div>
                            ) : null)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
