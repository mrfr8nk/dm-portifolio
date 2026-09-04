import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  FALLBACK_CONTENT,
  type FallbackRecord,
  type FallbackSection,
  isFallbackEnabled,
} from "@/data/fallbacks";

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      try {
        return await api.getSiteSettings();
      } catch {
        return {};
      }
    },
    staleTime: 60_000,
  });

function useFallbackCollection<T extends FallbackRecord[]>(
  section: FallbackSection,
  queryKey: string,
  fetcher: () => Promise<T>,
) {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const isAdminRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  const fallbackEnabled = !isAdminRoute && isFallbackEnabled(settings, section);

  return useQuery<T>({
    queryKey: [queryKey, fallbackEnabled],
    enabled: !settingsLoading,
    queryFn: async () => {
      try {
        const data = await fetcher();
        if (data?.length) return data;
      } catch {
        // The public portfolio should remain useful while the database is unavailable.
      }
      return (fallbackEnabled ? FALLBACK_CONTENT[section] : []) as unknown as T;
    },
    staleTime: 60_000,
  });
}

export const useProjects = (opts: { onlyVisible?: boolean } = {}) => {
  const query = useFallbackCollection("projects", "projects", api.getProjects);
  return {
    ...query,
    data: opts.onlyVisible ? query.data?.filter((p: any) => p.is_visible !== false) : query.data,
  };
};

export const useMilestones = () =>
  useFallbackCollection("milestones", "milestones", api.getMilestones);

export const useCurrentlyBuilding = () =>
  useFallbackCollection("currently_building", "currently_building", api.getCurrentlyBuilding);

export const useSocialLinks = () =>
  useFallbackCollection("social_links", "social_links", api.getSocialLinks);

export const useWhatIBuild = () =>
  useFallbackCollection("what_i_build", "what_i_build", api.getWhatIBuild);

export const useFooterLinks = () =>
  useFallbackCollection("footer_links", "footer_links", api.getFooterLinks);

export const useBlogPosts = (opts: { onlyPublished?: boolean } = {}) =>
  useFallbackCollection("blog_posts", "blog_posts", () => api.getBlogPosts(opts.onlyPublished));

export const useDevlogs = (opts: { onlyPublished?: boolean } = {}) =>
  useFallbackCollection("devlogs", "devlogs", () => api.getDevlogs(opts.onlyPublished));

export const useFriends = (opts: { onlyPublished?: boolean } = {}) =>
  useFallbackCollection("friends", "friends", () => api.getFriends(opts.onlyPublished));

export const useSkills = () =>
  useFallbackCollection("skills", "skills", api.getSkills);

export const useTestimonials = () =>
  useFallbackCollection("testimonials", "testimonials", api.getTestimonials);

export const useCertifications = () =>
  useFallbackCollection("certifications", "certifications", api.getCertifications);

export const useEducation = () =>
  useFallbackCollection("education", "education", api.getEducation);
