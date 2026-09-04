import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number;
  sort_order: number | null;
}

const TestimonialsSection = () => {
  const { data: items } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials" as any)
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      if (error) throw error;
      return (data as unknown as Testimonial[]) ?? [];
    },
  });

  if (!items?.length) return null;

  return (
    <section id="testimonials" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">
            // testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 hover:border-foreground/30 transition-all"
            >
              <div className="absolute -top-4 -right-4 opacity-[0.06] group-hover:opacity-10 transition-opacity">
                <Quote className="w-28 h-28" />
              </div>

              <div className="flex items-center gap-1 mb-4 relative">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < t.rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-sm leading-relaxed text-foreground/90 mb-6 relative">
                "{t.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-border/50 relative">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-mono font-bold">
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-xs text-muted-foreground truncate font-mono">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
