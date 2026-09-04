const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error || res.statusText);
  }
  return res.json() as Promise<T>;
}

type Body = Record<string, unknown>;

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string } }>(
      "/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }
    ),
  register: (email: string, password: string, secret: string) =>
    request<{ token: string; user: { id: string; email: string } }>(
      "/auth/register", { method: "POST", body: JSON.stringify({ email, password, secret }) }
    ),
  me: () => request<{ user: { id: string; email: string; role: string } }>("/auth/me"),

  // Site Settings
  getSiteSettings: () => request<Record<string, string>>("/site-settings"),
  updateSiteSettings: (data: Record<string, string>) =>
    request<{ ok: true }>("/site-settings", { method: "PUT", body: JSON.stringify(data) }),

  // Projects
  getProjects: () => request<Body[]>("/projects"),
  createProject: (data: Body) => request<Body>("/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: Body) => request<Body>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) => request<{ ok: true }>(`/projects/${id}`, { method: "DELETE" }),

  // Milestones
  getMilestones: () => request<Body[]>("/milestones"),
  createMilestone: (data: Body) => request<Body>("/milestones", { method: "POST", body: JSON.stringify(data) }),
  updateMilestone: (id: string, data: Body) => request<Body>(`/milestones/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMilestone: (id: string) => request<{ ok: true }>(`/milestones/${id}`, { method: "DELETE" }),

  // Currently Building
  getCurrentlyBuilding: () => request<Body[]>("/currently-building"),
  createCurrentlyBuilding: (data: Body) => request<Body>("/currently-building", { method: "POST", body: JSON.stringify(data) }),
  updateCurrentlyBuilding: (id: string, data: Body) => request<Body>(`/currently-building/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCurrentlyBuilding: (id: string) => request<{ ok: true }>(`/currently-building/${id}`, { method: "DELETE" }),

  // Social Links
  getSocialLinks: () => request<Body[]>("/social-links"),
  createSocialLink: (data: Body) => request<Body>("/social-links", { method: "POST", body: JSON.stringify(data) }),
  updateSocialLink: (id: string, data: Body) => request<Body>(`/social-links/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSocialLink: (id: string) => request<{ ok: true }>(`/social-links/${id}`, { method: "DELETE" }),

  // What I Build
  getWhatIBuild: () => request<Body[]>("/what-i-build"),
  createWhatIBuild: (data: Body) => request<Body>("/what-i-build", { method: "POST", body: JSON.stringify(data) }),
  updateWhatIBuild: (id: string, data: Body) => request<Body>(`/what-i-build/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteWhatIBuild: (id: string) => request<{ ok: true }>(`/what-i-build/${id}`, { method: "DELETE" }),

  // Footer Links
  getFooterLinks: () => request<Body[]>("/footer-links"),
  createFooterLink: (data: Body) => request<Body>("/footer-links", { method: "POST", body: JSON.stringify(data) }),
  updateFooterLink: (id: string, data: Body) => request<Body>(`/footer-links/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFooterLink: (id: string) => request<{ ok: true }>(`/footer-links/${id}`, { method: "DELETE" }),

  // Blog Posts
  getBlogPosts: (onlyPublished?: boolean) => request<Body[]>(`/blog-posts${onlyPublished ? "?published=true" : ""}`),
  getBlogPost: (slug: string) => request<Body>(`/blog-posts/${slug}`),
  createBlogPost: (data: Body) => request<Body>("/blog-posts", { method: "POST", body: JSON.stringify(data) }),
  updateBlogPost: (id: string, data: Body) => request<Body>(`/blog-posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlogPost: (id: string) => request<{ ok: true }>(`/blog-posts/${id}`, { method: "DELETE" }),

  // Devlogs
  getDevlogs: (onlyPublished?: boolean) => request<Body[]>(`/devlogs${onlyPublished ? "?published=true" : ""}`),
  createDevlog: (data: Body) => request<Body>("/devlogs", { method: "POST", body: JSON.stringify(data) }),
  updateDevlog: (id: string, data: Body) => request<Body>(`/devlogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDevlog: (id: string) => request<{ ok: true }>(`/devlogs/${id}`, { method: "DELETE" }),

  // Friends / community
  getFriends: (onlyPublished?: boolean) => request<Body[]>(`/friends${onlyPublished ? "?published=true" : ""}`),
  createFriend: (data: Body) => request<Body>("/friends", { method: "POST", body: JSON.stringify(data) }),
  updateFriend: (id: string, data: Body) => request<Body>(`/friends/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFriend: (id: string) => request<{ ok: true }>(`/friends/${id}`, { method: "DELETE" }),

  // Newsletter
  subscribeNewsletter: (email: string) =>
    request<{ subscribed: boolean; alreadySubscribed: boolean }>("/newsletter-subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  getNewsletterSubscriptions: () => request<Body[]>("/newsletter-subscriptions"),
  updateNewsletterSubscription: (id: string, status: "active" | "unsubscribed") =>
    request<Body>(`/newsletter-subscriptions/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteNewsletterSubscription: (id: string) =>
    request<{ ok: true }>(`/newsletter-subscriptions/${id}`, { method: "DELETE" }),

  // Skills
  getSkills: () => request<Body[]>("/skills"),
  createSkill: (data: Body) => request<Body>("/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id: string, data: Body) => request<Body>(`/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id: string) => request<{ ok: true }>(`/skills/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => request<Body[]>("/testimonials"),
  createTestimonial: (data: Body) => request<Body>("/testimonials", { method: "POST", body: JSON.stringify(data) }),
  updateTestimonial: (id: string, data: Body) => request<Body>(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTestimonial: (id: string) => request<{ ok: true }>(`/testimonials/${id}`, { method: "DELETE" }),

  // Certifications
  getCertifications: () => request<Body[]>("/certifications"),
  createCertification: (data: Body) => request<Body>("/certifications", { method: "POST", body: JSON.stringify(data) }),
  updateCertification: (id: string, data: Body) => request<Body>(`/certifications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCertification: (id: string) => request<{ ok: true }>(`/certifications/${id}`, { method: "DELETE" }),

  // Education
  getEducation: () => request<Body[]>("/education"),
  createEducation: (data: Body) => request<Body>("/education", { method: "POST", body: JSON.stringify(data) }),
  updateEducation: (id: string, data: Body) => request<Body>(`/education/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEducation: (id: string) => request<{ ok: true }>(`/education/${id}`, { method: "DELETE" }),

  // Contact Messages
  getContactMessages: () => request<Body[]>("/contact-messages"),
  createContactMessage: (data: Body) => request<Body>("/contact-messages", { method: "POST", body: JSON.stringify(data) }),
  updateContactMessage: (id: string, data: Body) => request<Body>(`/contact-messages/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteContactMessage: (id: string) => request<{ ok: true }>(`/contact-messages/${id}`, { method: "DELETE" }),

  // Upload
  uploadFile: async (file: File, folder = "uploads"): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch(`${BASE}/upload`, {
      method: "POST",
      headers: { ...authHeaders() },
      body: form,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json() as Promise<{ url: string }>;
  },
};

export function saveToken(token: string): void { localStorage.setItem("admin_token", token); }
export function clearToken(): void { localStorage.removeItem("admin_token"); }
export function hasToken(): boolean { return !!localStorage.getItem("admin_token"); }
