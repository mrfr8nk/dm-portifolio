import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TechIcon } from "@/lib/tech-icons";

interface Skill {
  id: string;
  category: string;
  name: string;
  percentage: number;
  icon_slug: string | null;
  sort_order: number | null;
}

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  languages: "Languages",
  devops: "DevOps & Security",
  mobile: "Mobile",
  ai: "AI / ML",
  cdn: "CDN & Storage",
  paas: "PaaS & Hosting",
};

const categoryOrder = ["frontend", "backend", "database", "cdn", "paas", "devops", "ai", "languages", "mobile"];

const SkillsSection = () => {
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills" as any)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data as unknown as Skill[]) ?? [];
    },
  });

  if (!skills?.length) return null;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const orderedCats = Object.keys(grouped).sort(
    (a, b) => (categoryOrder.indexOf(a) === -1 ? 999 : categoryOrder.indexOf(a)) -
              (categoryOrder.indexOf(b) === -1 ? 999 : categoryOrder.indexOf(b))
  );

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// skills</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tech Proficiency</h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {orderedCats.map((cat) => { const items = grouped[cat]; return (
            <div key={cat}>
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-5">
                {categoryLabels[cat] || cat}
              </h3>
              <div className="space-y-4">
                {items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <TechIcon name={s.icon_slug || s.name} className="w-4 h-4" />
                        <span className="text-sm text-foreground/90">{s.name}</span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{s.percentage}%</span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 + i * 0.05 }}
                        className="h-full bg-foreground rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ); })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
