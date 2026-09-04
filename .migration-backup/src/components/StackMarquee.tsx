import { TechIcon } from "@/lib/tech-icons";

const stack = [
  "React", "TypeScript", "Node.js", "Python", "Supabase", "PostgreSQL",
  "MongoDB", "Docker", "FastAPI", "Redis", "TailwindCSS", "Next.js",
  "WhatsApp", "Git", "Linux", "Framer", "Figma", "Vite",
];

const StackMarquee = () => (
  <section className="py-10 border-y border-border overflow-hidden">
    <div className="relative">
      <div className="marquee whitespace-nowrap">
        {[...stack, ...stack].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 mx-6 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors cursor-default"
          >
            <TechIcon name={item} className="w-4 h-4" />
            {item}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default StackMarquee;
