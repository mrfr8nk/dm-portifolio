import { motion } from "framer-motion";
import { TechIcon } from "@/lib/tech-icons";
import { useSkills } from "@/hooks/use-site-data";

interface Skill {
  id: string;
  category: string;
  name: string;
  percentage: number;
  icon_slug: string | null;
  iconSlug: string | null;
  sort_order: number | null;
}

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  data: "Data & Storage",
  devops: "DevOps & Cloud",
  tools: "Tools",
};

const categoryOrder = ["frontend", "backend", "data", "devops", "tools"];
const categoryMap: Record<string, string> = {
  frontend: "frontend",
  languages: "frontend",
  mobile: "frontend",
  backend: "backend",
  database: "data",
  data: "data",
  storage: "data",
  devops: "devops",
  cdn: "devops",
  paas: "devops",
  ai: "tools",
  tools: "tools",
};
const categoryDescriptions: Record<string, string> = {
  frontend: "Interfaces with a pulse",
  backend: "Logic that holds up",
  data: "State, storage, signal",
  devops: "Ship it. Keep it steady.",
  tools: "The daily toolkit",
};
const categoryLayout: Record<string, string> = {
  frontend: "lg:col-span-7",
  backend: "lg:col-span-5",
  data: "lg:col-span-5",
  devops: "lg:col-span-7",
  tools: "lg:col-span-12",
};

const SkillsSection = () => {
  const { data: skills } = useSkills();

  if (!skills?.length) return null;

  const grouped = (skills as unknown as Skill[]).reduce<Record<string, Skill[]>>((acc, s) => {
    const category = categoryMap[s.category] || "tools";
    (acc[category] = acc[category] || []).push(s);
    return acc;
  }, {
    frontend: [],
    backend: [],
    data: [],
    devops: [],
    tools: [],
  });

  const orderedCats = categoryOrder;

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 md:mb-16">
          <p className="eyebrow mb-3">// stack</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h2 className="display-font text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">A stack built for the whole distance.</h2>
            <p className="mono-font text-[10px] uppercase tracking-[0.16em] text-muted-foreground max-w-[15rem] leading-relaxed">Languages are the medium. Systems thinking is the craft.</p>
          </div>
          <div className="section-rule mt-7" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {orderedCats.map((cat) => { const items = grouped[cat]; return (
            <div key={cat} data-testid={`card-skill-category-${cat}`} className={`skill-card ${categoryLayout[cat]} rounded-2xl border border-border bg-card/55 p-5 md:p-6 min-h-[12rem] hover:border-primary/40 transition-colors`}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="mono-font text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-2">0{categoryOrder.indexOf(cat) + 1}</p>
                  <h3 className="display-font text-xl font-bold">{categoryLabels[cat]}</h3>
                </div>
                <span className="mono-font text-[10px] text-primary uppercase tracking-[0.12em] text-right">{categoryDescriptions[cat]}</span>
              </div>
              <div className="space-y-4">
                {items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                      <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TechIcon name={s.icon_slug || s.iconSlug || s.name} className="w-4 h-4" />
                        <span data-testid={`text-skill-${s.id}`} className="text-sm text-foreground/90">{s.name}</span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{s.percentage}%</span>
                    </div>
                      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 + i * 0.05 }}
                         className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
                {!items.length && <p className="text-xs text-muted-foreground/70">More tools coming into focus.</p>}
              </div>
            </div>
          ); })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
