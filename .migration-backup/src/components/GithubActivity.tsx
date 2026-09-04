import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-data";

const GithubActivity = () => {
  const { data: settings } = useSiteSettings();
  const username = settings?.github_username;
  if (!username) return null;

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// activity</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <Github className="w-7 h-7" /> GitHub
          </h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <motion.a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="block border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors overflow-x-auto"
        >
          <img
            src={`https://ghchart.rshah.org/000000/${username}`}
            alt={`${username} GitHub contribution graph`}
            className="w-full min-w-[600px] dark:invert"
            loading="lazy"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <img src={`https://github-readme-stats.vercel.app/api?username=${username}&hide_border=true&bg_color=00000000&title_color=ffffff&text_color=a1a1aa&icon_color=ffffff`} alt="stats" className="h-32" loading="lazy" />
            <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&bg_color=00000000&title_color=ffffff&text_color=a1a1aa`} alt="langs" className="h-32" loading="lazy" />
          </div>
          <p className="font-mono text-xs text-muted-foreground mt-4">@{username} →</p>
        </motion.a>
      </div>
    </section>
  );
};

export default GithubActivity;
