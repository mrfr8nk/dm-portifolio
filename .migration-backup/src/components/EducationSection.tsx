import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/icons";
import { GraduationCap } from "lucide-react";

interface Result {
  subject: string;
  grade: string;
}

const gradeColor = (grade: string) => {
  const g = grade.trim().toUpperCase();
  if (g === "A" || g.startsWith("UNIT 1")) return "bg-foreground text-background border-foreground";
  if (g === "B" || g.startsWith("UNIT 2")) return "bg-foreground/10 text-foreground border-foreground/30";
  if (g === "C") return "bg-muted text-muted-foreground border-border";
  return "bg-transparent text-muted-foreground border-border";
};

const EducationSection = () => {
  const { data: education } = useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase.from("education" as any).select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  if (!education?.length) return null;

  return (
    <section id="education" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// education</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <GraduationCap className="w-8 h-8" /> Academic Journey
          </h2>
          <div className="w-12 h-px bg-foreground/20" />
          <p className="text-muted-foreground text-sm mt-4 max-w-2xl">From Grade 1 at Tamuka Primary to A-Levels at St Mary's — the foundation behind the code.</p>
        </motion.div>

        <div className="space-y-5">
          {education.map((e, i) => {
            const Icon = getIcon(e.icon_name || "graduation-cap");
            const results: Result[] = Array.isArray(e.results) ? e.results : [];
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`group relative border rounded-2xl p-6 md:p-8 transition-all hover:border-foreground/30 ${
                  e.is_highlight ? "border-foreground/20 bg-card/50" : "border-border bg-transparent"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${e.is_highlight ? "bg-foreground text-background" : "bg-secondary text-foreground"}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                      <h3 className="text-lg md:text-xl font-bold">{e.level}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mb-1">{e.school}</p>
                    {e.status && (
                      <p className="font-mono text-xs text-muted-foreground mb-3">{e.status}</p>
                    )}
                    {e.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">{e.description}</p>
                    )}

                    {results.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                        {results.map((r) => (
                          <div key={r.subject} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs ${gradeColor(r.grade)}`}>
                            <span className="font-medium">{r.subject}</span>
                            <span className="font-mono opacity-80">{r.grade}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
