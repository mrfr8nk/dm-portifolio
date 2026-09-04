import { ArrowUpRight } from "lucide-react";
import { useSocialLinks, useFooterLinks } from "@/hooks/use-site-data";
import { getIcon } from "@/lib/icons";

const Footer = () => {
  const { data: socials } = useSocialLinks();
  const { data: footerLinks } = useFooterLinks();

  // Group footer links by section
  const sections: Record<string, { label: string; href: string }[]> = {};
  footerLinks?.forEach((l) => {
    if (!sections[l.section]) sections[l.section] = [];
    sections[l.section].push({ label: l.label, href: l.href });
  });

  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/favicon.ico" alt="Darrell Mucheri logo" className="w-7 h-7 rounded-md" />
              <p className="font-mono font-bold text-sm">d.m<span className="text-muted-foreground">/</span></p>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px]">Building the future, one commit at a time.</p>
          </div>

          {Object.entries(sections).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} Darrell Mucheri</p>
          <div className="flex gap-2">
            {socials?.map((s) => {
              const Icon = getIcon(s.icon_name);
              return (
                <a key={s.id} href={s.url} aria-label={s.platform} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
