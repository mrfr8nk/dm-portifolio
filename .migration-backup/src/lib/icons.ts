import {
  Bot, School, Workflow, Code, Layers, Server, Rocket, Sparkles,
  MessageSquare, GraduationCap, Cog, Hammer, BookOpen, ArrowRight,
  Github, Twitter, Linkedin, ArrowUpRight, Atom, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  bot: Bot,
  school: School,
  workflow: Workflow,
  code: Code,
  layers: Layers,
  server: Server,
  rocket: Rocket,
  sparkles: Sparkles,
  "message-square": MessageSquare,
  "graduation-cap": GraduationCap,
  cog: Cog,
  hammer: Hammer,
  "book-open": BookOpen,
  "arrow-right": ArrowRight,
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  "arrow-up-right": ArrowUpRight,
  atom: Atom,
};

export const getIcon = (name: string): LucideIcon => iconMap[name] || Code;
export const iconNames = Object.keys(iconMap);
