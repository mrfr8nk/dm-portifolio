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
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="eyebrow mb-3">// selected work</p>
          <h2 className="display-font text-4xl md:text-5xl font-bold mb-4 tracking-tight">Built, shipped, learned.</h2>
          <div className="section-rule" />
        </motion.div>

        <div className="space-y-4">
          {projects.map((p, i) => {
            const Icon = getIcon(p.icon_name || "bot");
            const cs = (p.case_study || {}) as Record<string, string>;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="glass-card project-card group overflow-hidden">
                  {p.image_url && (
                      <div className="project-media aspect-[16/7] overflow-hidden bg-secondary border-b border-border">
                      <img
                        src={p.image_url}
                        alt={`${p.title} project preview`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={(event) => event.currentTarget.parentElement?.classList.add("is-loaded")}
                      />
                      <span className="absolute left-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.16em] text-background/80 bg-foreground/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                        0{i + 1} / shipped
                      </span>
                    </div>
                  )}
                  <div className="p-6 md:p-8 relative z-[1]">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-[-6deg]">
                        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h3 className="display-font font-bold text-xl mb-2">{p.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.description}</p>
                         {p.impact && <p className="text-xs font-mono text-muted-foreground mb-4 group-hover:text-foreground/75 transition-colors">{p.impact}</p>}
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
                              <a href={(p as any).demo_url} target="_blank" rel="noopener noreferrer" aria-label={`Open live demo for ${p.title}`} data-testid={`link-project-demo-${p.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-primary text-primary-foreground hover:translate-y-[-2px] transition-transform pressable">
                              <ExternalLink className="w-3 h-3" aria-hidden="true" /> Live Demo
                            </a>
                          )}
                          {(p as any).source_url && (
                              <a href={(p as any).source_url} target="_blank" rel="noopener noreferrer" aria-label={`Open source code for ${p.title}`} data-testid={`link-project-source-${p.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors pressable">
                              <Github className="w-3 h-3" aria-hidden="true" /> Source
                            </a>
                          )}
                          {Object.keys(cs).filter((k) => cs[k]).length > 0 && (
                             <button onClick={() => setOpenCase(openCase === i ? null : i)} aria-expanded={openCase === i} data-testid={`button-case-study-${p.id}`} className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors ml-1 focus-ring">
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
