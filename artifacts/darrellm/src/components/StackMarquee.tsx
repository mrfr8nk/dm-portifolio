import { TechIcon } from "@/lib/tech-icons";
import { useSkills } from "@/hooks/use-site-data";

const fallbackStack = [
  "React", "TypeScript", "Node.js", "Python", "MongoDB", "Docker",
  "FastAPI", "Redis", "TailwindCSS", "Next.js",
  "WhatsApp", "Git", "Linux", "Framer", "Figma", "Vite",
];

const StackMarquee = () => {
  const { data: skills } = useSkills();
  const stack = skills?.length
    ? Array.from(new Set((skills as unknown as Array<{ name: string }>).map((skill) => skill.name)))
    : fallbackStack;

  return (
    <section className="py-6 border-y border-border overflow-hidden bg-secondary/40" aria-label="Technology stack">
      <div className="relative">
        <div className="marquee whitespace-nowrap">
          {[...stack, ...stack].map((item, i) => (
          <span
            key={i}
            data-testid={`marquee-skill-${i}`}
            className="inline-flex items-center gap-2 mx-6 text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-default uppercase tracking-wider"
          >
            <TechIcon name={item} className="w-4 h-4" />
            {item}
          </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackMarquee;
