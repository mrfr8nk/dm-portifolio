CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  description TEXT,
  skills TEXT[] DEFAULT '{}'::text[],
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible certifications"
ON public.certifications FOR SELECT
USING (is_visible = true);

CREATE POLICY "Admins can manage certifications"
ON public.certifications FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();