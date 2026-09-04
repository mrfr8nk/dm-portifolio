import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSiteSettings } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { FALLBACK_SECTION_SETTINGS } from "@/data/fallbacks";

const settingsKeys = [
  { key: "name", label: "Full Name" },
  { key: "tagline", label: "Hero Tagline" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "hero_greeting_prefix", label: "Hero Prefix (e.g. ~/darrell)" },
  { key: "github_username", label: "GitHub Username (for activity graph)" },
  { key: "synapex_mission", label: "Synapex Mission Text" },
  { key: "synapex_tagline", label: "Synapex Tagline" },
  { key: "hiring_headline", label: "Hire Me Headline" },
  { key: "hiring_copy", label: "Hire Me Supporting Copy" },
  { key: "hiring_fit", label: "Hire Me Fit Line" },
  { key: "hiring_cta", label: "Hire Me Button Label" },
];

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSiteSettings(form);
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Settings saved!" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-5">
        <ImageUpload
          value={form.profile_image_url}
          onChange={(url) => setForm({ ...form, profile_image_url: url })}
          folder="profile"
          label="Profile Picture"
          helperText="Uploaded securely to the configured CDN."
        />
        <ImageUpload
          value={form.cv_url}
          onChange={(url) => setForm({ ...form, cv_url: url })}
          folder="cv"
          label="CV / Resume"
          accept=".pdf,application/pdf"
          helperText="Upload a PDF; the hero CV button will use the CDN link."
        />

        {settingsKeys.map(({ key, label }) => (
          <div key={key}>
            <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
            {key === "synapex_mission" || key === "tagline" ? (
              <textarea
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                rows={3}
                className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
            )}
          </div>
        ))}

        <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/30 transition-colors">
          <span>
            <span className="block text-sm font-medium">Show Hire Me section</span>
            <span className="block text-xs text-muted-foreground mt-1">Keep the hiring CTA visible on the public portfolio.</span>
          </span>
          <input
            type="checkbox"
            checked={form.hiring_enabled !== "false"}
            onChange={(e) => setForm({ ...form, hiring_enabled: e.target.checked ? "true" : "false" })}
            className="h-4 w-4 accent-foreground shrink-0"
          />
        </label>

        <div className="pt-8 mt-8 border-t border-border">
          <h2 className="font-bold text-base mb-2">Fallback content</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Show starter content when a section has no saved records yet. Your saved content always replaces the starter content automatically.
          </p>
          <div className="space-y-3">
            {FALLBACK_SECTION_SETTINGS.map(({ key, label, description }) => {
              const settingKey = `fallback_${key}_enabled`;
              const enabled = form[settingKey] !== "false";
              return (
                <label key={key} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/30 transition-colors">
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground mt-1">{description}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setForm({ ...form, [settingKey]: e.target.checked ? "true" : "false" })}
                    className="h-4 w-4 accent-foreground shrink-0"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
