import { motion } from "framer-motion";
import { ArrowUpRight, AtSign, Link2 } from "lucide-react";
import { useSocialLinks } from "@/hooks/use-site-data";
import { getIcon } from "@/lib/icons";
import { motionDuration, motionEase, revealViewport } from "@/lib/motion";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name?: string;
  username?: string;
  handle?: string;
  sort_order?: number;
}

const placeholderUrls = new Set([
  "https://github.com",
  "https://www.linkedin.com",
  "mailto:darrell@example.com",
]);

function getHandle(link: SocialLink) {
  if (link.handle || link.username) return link.handle || link.username;
  if (link.url.startsWith("mailto:")) return link.url.replace("mailto:", "");
  try {
    const url = new URL(link.url);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.length ? `@${parts[parts.length - 1]}` : url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

const SocialLinksSection = () => {
  const { data } = useSocialLinks();
  const links = ((data || []) as unknown as SocialLink[])
    .filter((link) => link.url && !placeholderUrls.has(link.url))
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section id="connect" className="section-padding section-tint">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: motionDuration.section, ease: motionEase }}
          className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5"
        >
          <div>
            <p className="eyebrow mb-3">// elsewhere</p>
            <h2 className="display-font text-4xl md:text-5xl font-bold tracking-tight">
              Find me in the wild.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            The best work usually starts with a good conversation. Pick a place that feels natural.
          </p>
        </motion.div>

        {links.length ? (
          <div className="social-grid">
            {links.map((link, index) => {
              const Icon = getIcon(link.icon_name || link.platform.toLowerCase());
              const handle = getHandle(link);
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${link.platform}${handle ? ` ${handle}` : ""} in a new tab`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={revealViewport}
                  transition={{ delay: index * 0.06, duration: motionDuration.normal, ease: motionEase }}
                  className="social-link group"
                >
                  <span className="social-link-icon" aria-hidden="true">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="social-link-platform">{link.platform}</span>
                    <span className="social-link-handle">
                      {handle || "Open profile"}
                    </span>
                  </span>
                  <ArrowUpRight className="social-link-arrow" aria-hidden="true" />
                </motion.a>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl p-6 md:p-8 text-sm text-muted-foreground">
            Social profiles will appear here once they are published from the admin panel.
          </div>
        )}

        <p className="mt-7 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link2 className="w-3 h-3 text-primary" aria-hidden="true" />
          Links are managed from the portfolio admin
          <AtSign className="ml-auto hidden sm:block w-3 h-3 text-accent" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
};

export default SocialLinksSection;