import { useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useDevlogs } from "@/hooks/use-site-data";

type Devlog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  status?: string;
  published_at: string;
  created_at?: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const DevlogsSection = () => {
  const { data: rawDevlogs } = useDevlogs({ onlyPublished: true });
  const devlogs = rawDevlogs as Devlog[] | undefined;
  const [openId, setOpenId] = useState<string | null>(null);

  if (!devlogs?.length) return null;
  const [featured, ...rest] = devlogs;

  return (
    <section id="devlogs" className="section-padding section-tint">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-5"
        >
          <div>
            <p className="eyebrow mb-3">// build notes</p>
            <h2 className="display-font text-4xl md:text-5xl font-bold tracking-tight">Shipping in public.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Small updates from the workbench: decisions, misses, and what changed.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="devlog-feature"
          >
            <div className="flex items-center justify-between gap-4 mb-7">
              <span className="devlog-status">{featured.status || "build note"}</span>
              <span className="mono-font text-[10px] text-muted-foreground inline-flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" />
                {formatDate(featured.published_at || featured.created_at || new Date().toISOString())}
              </span>
            </div>
            <div className="flex items-start gap-4">
              <span className="devlog-index">01</span>
              <div>
                <h3 className="display-font text-2xl md:text-3xl font-bold leading-tight mb-4">{featured.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{featured.excerpt}</p>
                <button
                  type="button"
                  onClick={() => setOpenId(openId === featured.id ? null : featured.id)}
                  aria-expanded={openId === featured.id}
                  className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors focus-ring"
                >
                  {openId === featured.id ? "Close update" : "Read update"}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {openId === featured.id && (
              <p className="devlog-body mt-7 ml-10 whitespace-pre-line">{featured.content}</p>
            )}
            {(featured.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-8 ml-10">
                {featured.tags.slice(0, 4).map((tag: string) => (
                  <span key={tag} className="devlog-tag">#{tag}</span>
                ))}
              </div>
            )}
          </motion.article>

          <div className="devlog-list">
            {rest.slice(0, 4).map((item, index) => {
              const isOpen = openId === item.id;
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={`devlog-row ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left focus-ring"
                  >
                    <span className="devlog-row-top">
                      <span className="devlog-index">{String(index + 2).padStart(2, "0")}</span>
                      <span className="mono-font text-[10px] text-muted-foreground">{formatDate(item.published_at || item.created_at || new Date().toISOString())}</span>
                      <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                    </span>
                    <span className="flex items-start gap-3 mt-3">
                      <Terminal className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span>
                        <span className="block font-semibold text-base">{item.title}</span>
                        <span className="block text-sm text-muted-foreground leading-relaxed mt-1">{item.excerpt}</span>
                      </span>
                    </span>
                  </button>
                  {isOpen && <p className="devlog-body ml-9 mt-4 whitespace-pre-line">{item.content}</p>}
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevlogsSection;