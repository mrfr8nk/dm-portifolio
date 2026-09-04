import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, BookOpen } from "lucide-react";
import { useBlogPosts } from "@/hooks/use-site-data";
import { Link } from "react-router-dom";

const readingTime = (text: string) => {
  const words = (text || "").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogSection = () => {
  const { data: posts } = useBlogPosts({ onlyPublished: true });
  if (!posts?.length) return null;

  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex items-end justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// writing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From the Blog</h2>
            <div className="w-12 h-px bg-foreground/20" />
            <p className="text-muted-foreground text-sm mt-4 max-w-xl">
              Notes on building, breaking, and shipping. Code, lessons learned, and the founder journey.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </div>
        </motion.div>

        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <Link
            to={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-2 gap-0 rounded-2xl border border-border bg-card/40 backdrop-blur overflow-hidden hover:border-foreground/30 hover:bg-card/70 transition-all"
          >
            {featured.cover_image_url ? (
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-secondary">
                <img
                  src={featured.cover_image_url}
                  alt={featured.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] md:aspect-auto bg-gradient-to-br from-secondary via-card to-background flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-foreground text-background">Featured</span>
                <span className="text-xs font-mono text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(featured.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <span className="text-xs font-mono text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime(featured.content)} min
                </span>
              </div>
              <h3 className="font-bold text-2xl md:text-3xl leading-tight mb-3 tracking-tight group-hover:text-foreground transition-colors">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
                  {featured.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between gap-4">
                {(featured.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {featured.tags!.slice(0, 3).map((t) => (
                      <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">#{t}</span>
                    ))}
                  </div>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-mono text-foreground group-hover:gap-2 transition-all">
                  Read post <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Rest grid */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {rest.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/blog/${p.slug}`}
                  className="group block rounded-2xl border border-border overflow-hidden hover:border-foreground/30 hover:-translate-y-0.5 transition-all h-full bg-card/30"
                >
                  {p.cover_image_url && (
                    <div className="aspect-[16/9] overflow-hidden bg-secondary">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readingTime(p.content)} min
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-foreground transition-colors">{p.title}</h3>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    {p.excerpt && <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">{p.excerpt}</p>}
                    {(p.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags!.slice(0, 4).map((t) => (
                          <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
