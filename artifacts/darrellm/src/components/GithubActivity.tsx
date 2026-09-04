import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, Users, BookOpen, ExternalLink, Activity } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-data";

interface GHUser {
  public_repos: number;
  followers: number;
  following: number;
  name: string;
  bio: string | null;
}

interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Dart: "#00B4AB",
  Shell: "#89e051",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const StatPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | undefined }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-border bg-accent/30 hover:bg-accent/60 transition-colors"
  >
    <span className="text-muted-foreground">{icon}</span>
    <div>
      <p className="text-lg font-bold leading-none">{value?.toLocaleString() ?? "—"}</p>
      <p className="font-mono text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  </motion.div>
);

const RepoCard = ({ repo, index }: { repo: GHRepo; index: number }) => {
  const color = repo.language ? (LANG_COLORS[repo.language] ?? "#8b949e") : "#8b949e";
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group project-card flex flex-col gap-2 p-4 rounded-lg border border-border bg-accent/20 hover:bg-accent/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="font-mono text-sm font-medium truncate group-hover:text-foreground transition-colors">{repo.name}</span>
        </div>
        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {repo.description || "No description"}
      </p>
      <div className="flex items-center gap-3 mt-auto pt-1">
        {repo.language && (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <Star className="w-3 h-3" />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <GitFork className="w-3 h-3" />
            {repo.forks_count}
          </span>
        )}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground/60">{timeAgo(repo.pushed_at)}</span>
      </div>
    </motion.a>
  );
};

const GithubActivity = () => {
  const { data: settings } = useSiteSettings();
  const username = settings?.github_username;
  const [user, setUser] = useState<GHUser | null>(null);
  const [repos, setRepos] = useState<GHRepo[]>([]);

  useEffect(() => {
    if (!username) return;
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => r.json())
      .then(setUser)
      .catch(() => null);
    fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`)
      .then((r) => r.json())
      .then((data: GHRepo[]) => Array.isArray(data) ? setRepos(data.filter((r) => !r.name.startsWith(username))) : null)
      .catch(() => null);
  }, [username]);

  if (!username) return null;

  return (
    <section className="section-padding" id="github">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// activity</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <Github className="w-7 h-7" /> GitHub
          </h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <StatPill icon={<BookOpen className="w-4 h-4" />} label="Repos" value={user?.public_repos} />
            <StatPill icon={<Users className="w-4 h-4" />} label="Followers" value={user?.followers} />
            <StatPill icon={<Activity className="w-4 h-4" />} label="Following" value={user?.following} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border bg-accent/20 p-5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">contribution graph</p>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                @{username} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <img
                src={`https://ghchart.rshah.org/161b22/${username}`}
                alt={`${username} GitHub contribution graph`}
                className="w-full min-w-[600px] dark:invert dark:brightness-75 dark:contrast-125 rounded"
                loading="lazy"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5">
              <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">less</span>
              {["bg-foreground/5","bg-foreground/20","bg-foreground/40","bg-foreground/60","bg-foreground/90"].map((c,i) => (
                <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">more</span>
            </div>
          </motion.div>

          <div>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">recent pushes</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {repos.slice(0, 6).map((r, i) => <RepoCard key={r.id} repo={r} index={i} />)}
            </div>
          </div>

          <motion.a
            href={`https://github.com/${username}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-lg font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent/30 transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            view all {user?.public_repos ?? ""} repositories on github
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default GithubActivity;
