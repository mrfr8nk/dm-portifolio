export type FallbackRecord = Record<string, any>;

export const FALLBACK_CONTENT = {
  what_i_build: [
    {
      id: "fallback-what-1",
      title: "Useful web products",
      purpose: "Fast, focused interfaces that turn complicated workflows into clear next steps.",
      tech: ["React", "TypeScript", "Tailwind"],
      impact: "Less friction for the people using the product every day.",
      icon_name: "layout-dashboard",
    },
    {
      id: "fallback-what-2",
      title: "Automation systems",
      purpose: "Bots, integrations, and internal tools that remove repetitive work.",
      tech: ["Node.js", "APIs", "MongoDB"],
      impact: "More time for high-value work and fewer manual handoffs.",
      icon_name: "bot",
    },
    {
      id: "fallback-what-3",
      title: "Developer experiences",
      purpose: "Practical systems that help teams learn, collaborate, and ship with confidence.",
      tech: ["Open source", "Documentation", "Community"],
      impact: "A smoother path from a first idea to a working release.",
      icon_name: "users",
    },
  ],
  skills: [
    { id: "fallback-skill-1", category: "frontend", name: "React", percentage: 92, icon_slug: "react", sort_order: 1 },
    { id: "fallback-skill-2", category: "frontend", name: "TypeScript", percentage: 88, icon_slug: "typescript", sort_order: 2 },
    { id: "fallback-skill-3", category: "backend", name: "Node.js", percentage: 86, icon_slug: "nodejs", sort_order: 1 },
    { id: "fallback-skill-4", category: "backend", name: "Express", percentage: 82, icon_slug: "express", sort_order: 2 },
    { id: "fallback-skill-5", category: "database", name: "MongoDB", percentage: 78, icon_slug: "mongodb", sort_order: 1 },
    { id: "fallback-skill-6", category: "database", name: "PostgreSQL", percentage: 72, icon_slug: "postgresql", sort_order: 2 },
    { id: "fallback-skill-7", category: "devops", name: "Git", percentage: 88, icon_slug: "git", sort_order: 1 },
    { id: "fallback-skill-8", category: "devops", name: "Docker", percentage: 70, icon_slug: "docker", sort_order: 2 },
    { id: "fallback-skill-9", category: "tools", name: "Figma", percentage: 68, icon_slug: "figma", sort_order: 1 },
  ],
  projects: [
    {
      id: "fallback-project-1",
      title: "Portfolio systems",
      description: "A content-driven portfolio that keeps the story, work, and contact experience in one place.",
      impact: "A clear home for ideas, shipped work, and the next opportunity.",
      tech: ["React", "TypeScript", "Express"],
      icon_name: "layers",
      is_visible: true,
      sort_order: 1,
      case_study: {
        problem: "A personal portfolio should be easy to keep current.",
        thought: "Make every section editable without changing the frontend.",
        techReason: "A small React client and API keep the content flexible.",
        result: "A durable foundation for the public site.",
      },
    },
    {
      id: "fallback-project-2",
      title: "Automation toolkit",
      description: "Small, dependable tools that connect services and take care of repetitive tasks.",
      impact: "More consistent processes with less manual effort.",
      tech: ["Node.js", "REST APIs", "MongoDB"],
      icon_name: "bot",
      is_visible: true,
      sort_order: 2,
    },
    {
      id: "fallback-project-3",
      title: "Learning in public",
      description: "Experiments and notes that turn new ideas into working software.",
      impact: "Progress you can see, share, and build on.",
      tech: ["JavaScript", "Python", "Git"],
      icon_name: "book-open",
      is_visible: true,
      sort_order: 3,
    },
  ],
  milestones: [
    { id: "fallback-milestone-1", year: "01", title: "Started building", description: "Curiosity turned into a habit of making things that solve real problems.", icon_name: "sparkles", is_highlight: false, sort_order: 1 },
    { id: "fallback-milestone-2", year: "02", title: "Found the web", description: "Frontend and backend work became a way to turn ideas into useful experiences.", icon_name: "globe", is_highlight: true, sort_order: 2 },
    { id: "fallback-milestone-3", year: "03", title: "Started shipping", description: "Projects became products as design, code, and feedback came together.", icon_name: "rocket", is_highlight: false, sort_order: 3 },
    { id: "fallback-milestone-4", year: "Now", title: "Building what matters", description: "Learning quickly, collaborating openly, and making software people can rely on.", icon_name: "code-2", is_highlight: false, sort_order: 4 },
  ],
  currently_building: [
    { id: "fallback-currently-1", category: "Building", items: ["Useful developer tools", "Small products with clear outcomes"], icon_name: "hammer", sort_order: 1 },
    { id: "fallback-currently-2", category: "Learning", items: ["System design", "Product thinking", "Better technical writing"], icon_name: "book-open", sort_order: 2 },
    { id: "fallback-currently-3", category: "Exploring", items: ["AI-assisted workflows", "Community-led learning"], icon_name: "compass", sort_order: 3 },
  ],
  social_links: [
    { id: "fallback-social-1", platform: "GitHub", url: "https://github.com", icon_name: "github", sort_order: 1 },
    { id: "fallback-social-2", platform: "LinkedIn", url: "https://www.linkedin.com", icon_name: "linkedin", sort_order: 2 },
    { id: "fallback-social-3", platform: "Email", url: "mailto:darrell@example.com", icon_name: "mail", sort_order: 3 },
  ],
  footer_links: [
    { id: "fallback-footer-1", section: "Explore", label: "About", href: "#about", sort_order: 1 },
    { id: "fallback-footer-2", section: "Explore", label: "Projects", href: "#projects", sort_order: 2 },
    { id: "fallback-footer-3", section: "Connect", label: "Contact", href: "#contact", sort_order: 1 },
  ],
  blog_posts: [
    {
      id: "fallback-post-1",
      slug: "building-in-public",
      title: "Building in public, one useful step at a time",
      excerpt: "A short note on turning small experiments into work that can help someone else.",
      content: "Good software starts with a clear problem, a small first step, and the patience to improve it with real feedback.",
      tags: ["building", "lessons"],
      published_at: "2026-01-15T00:00:00.000Z",
      is_published: true,
    },
    {
      id: "fallback-post-2",
      slug: "shipping-with-clarity",
      title: "Shipping with clarity",
      excerpt: "The simplest reliable workflow is often the one that makes the next decision obvious.",
      content: "Clarity is a feature. It helps teams choose what to build, what to leave out, and what to improve next.",
      tags: ["product", "engineering"],
      published_at: "2025-12-08T00:00:00.000Z",
      is_published: true,
    },
  ],
  devlogs: [
    {
      id: "fallback-devlog-1",
      title: "A small release is still a release",
      excerpt: "A field note on tightening the rough edges before inviting more people in.",
      content: "The last ten percent is where a useful idea becomes something people can trust. I am learning to make room for that work.",
      tags: ["shipping", "build-in-public"],
      status: "shipped",
      published_at: "2026-02-04T00:00:00.000Z",
      is_published: true,
    },
    {
      id: "fallback-devlog-2",
      title: "Choosing the boring path on purpose",
      excerpt: "When a dependable primitive is available, novelty is rarely the best feature.",
      content: "Good systems leave energy for the problem that matters. Today that meant choosing the smallest reliable tool and moving on.",
      tags: ["engineering", "decisions"],
      status: "thinking",
      published_at: "2026-01-28T00:00:00.000Z",
      is_published: true,
    },
  ],
  friends: [],
  testimonials: [
    { id: "fallback-testimonial-1", name: "Your next collaborator", role: "Builder", company: "A good team", quote: "The best work happens when thoughtful ideas meet consistent execution.", rating: 5, is_visible: true, sort_order: 1 },
    { id: "fallback-testimonial-2", name: "A future client", role: "Founder", company: "A growing product", quote: "Clear communication and useful software make a meaningful difference.", rating: 5, is_visible: true, sort_order: 2 },
  ],
  certifications: [
    { id: "fallback-certification-1", title: "Full-Stack Development", issuer: "Professional learning", description: "A growing foundation across frontend, backend, databases, and deployment.", issue_date: "In progress", skills: ["React", "Node.js"], is_visible: true, sort_order: 1 },
    { id: "fallback-certification-2", title: "Continuous Learning", issuer: "Independent study", description: "Practical learning through projects, documentation, and real feedback.", issue_date: "Ongoing", skills: ["Systems", "Product"], is_visible: true, sort_order: 2 },
  ],
  education: [
    { id: "fallback-education-1", level: "Foundations", period: "Early years", school: "Curiosity and self-directed learning", status: "Completed", description: "A habit of asking how things work and then building a small version.", results: [], icon_name: "book-open", is_highlight: false, sort_order: 1 },
    { id: "fallback-education-2", level: "Software development", period: "Ongoing", school: "Projects, practice, and community", status: "Always learning", description: "Growing through shipped work, collaboration, and thoughtful iteration.", results: [], icon_name: "graduation-cap", is_highlight: true, sort_order: 2 },
  ],
} satisfies Record<string, FallbackRecord[]>;

export type FallbackSection = keyof typeof FALLBACK_CONTENT;

export const FALLBACK_SECTION_SETTINGS: Array<{ key: FallbackSection; label: string; description: string }> = [
  { key: "what_i_build", label: "What I Build", description: "Introductory areas of work" },
  { key: "skills", label: "Skills", description: "Technical skills and proficiency" },
  { key: "projects", label: "Projects", description: "Selected work and case studies" },
  { key: "milestones", label: "Journey", description: "Timeline milestones" },
  { key: "currently_building", label: "Currently", description: "What is being worked on now" },
  { key: "social_links", label: "Social Links", description: "Footer social profiles" },
  { key: "footer_links", label: "Footer Links", description: "Footer navigation" },
  { key: "blog_posts", label: "Blog", description: "Published writing" },
  { key: "devlogs", label: "Devlogs", description: "Short build notes" },
  { key: "friends", label: "Friends", description: "Community profiles" },
  { key: "testimonials", label: "Testimonials", description: "Quotes and recommendations" },
  { key: "certifications", label: "Certifications", description: "Credentials and certificates" },
  { key: "education", label: "Education", description: "Academic and learning history" },
];

export function isFallbackEnabled(settings: Record<string, string> | undefined, section: FallbackSection): boolean {
  return settings?.[`fallback_${section}_enabled`] !== "false";
}