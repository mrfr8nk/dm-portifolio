import { motion } from "framer-motion";
import { Award, ExternalLink, BadgeCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CertificationsSection = () => {
  const { data: certs } = useQuery({
    queryKey: ["certifications", true],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certifications" as any)
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  if (!certs?.length) return null;

  return (
    <section id="certifications" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">
            // credentials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications</h2>
          <div className="w-12 h-px bg-foreground/20" />
          <p className="text-muted-foreground text-sm mt-4 max-w-xl">
            Verified credentials from courses, exams and platforms I've completed along the way.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c, i) => {
            const Wrapper: any = c.credential_url ? "a" : "div";
            const wrapperProps = c.credential_url
              ? { href: c.credential_url, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Wrapper
                  {...wrapperProps}
                  className="group block h-full rounded-2xl border border-border bg-card/40 backdrop-blur p-5 hover:border-foreground/30 hover:bg-card/70 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.title}
                        loading="lazy"
                        className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm leading-tight mb-0.5 truncate group-hover:text-foreground transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {c.issuer}
                      </p>
                    </div>
                    {c.credential_url && (
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>

                  {c.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                      {c.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      <BadgeCheck className="w-3 h-3" />
                      {c.issue_date || "Verified"}
                    </div>
                    {c.credential_id && (
                      <span className="font-mono text-[10px] text-muted-foreground/60 truncate max-w-[100px]">
                        {c.credential_id}
                      </span>
                    )}
                  </div>

                  {(c.skills || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {c.skills!.slice(0, 4).map((s: string) => (
                        <span
                          key={s}
                          className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
