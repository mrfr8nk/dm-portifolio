-- Add visibility + optional image to projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS image_url text;

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  tags text[] DEFAULT '{}'::text[],
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blog_posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage blog_posts"
  ON public.blog_posts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for uploads (profile pic, project images, blog covers)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read site-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

CREATE POLICY "Admins can upload site-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'::app_role));