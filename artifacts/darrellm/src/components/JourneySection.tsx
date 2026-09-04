import { motion } from "framer-motion";
import { useMilestones } from "@/hooks/use-site-data";
import { getIcon } from "@/lib/icons";

const JourneySection = () => {
  const { data: milestones } = useMilestones();

  if (!milestones?.length) return null;

  return (
    <section id="journey" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// journey</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Timeline</h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {milestones.map((m, i) => {
              const Icon = getIcon(m.icon_name || "code");
              return (
                <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-6 relative">
                  <div className={`w-10 h-10 rounded-md shrink-0 flex items-center justify-center z-10 ${m.is_highlight ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="pt-1.5">
                    <span className="font-mono text-xs text-muted-foreground">{m.year}</span>
                    <h3 className={`font-bold text-sm mt-0.5 mb-1 ${m.is_highlight ? "text-foreground" : "text-foreground/80"}`}>{m.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
