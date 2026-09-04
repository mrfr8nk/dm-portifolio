import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

const settingsKeys = [
  { key: "name", label: "Full Name" },
  { key: "tagline", label: "Hero Tagline" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "hero_greeting_prefix", label: "Hero Prefix (e.g. ~/darrell)" },
  { key: "cv_url", label: "CV Download URL" },
  { key: "github_username", label: "GitHub Username (for activity graph)" },
  { key: "synapex_mission", label: "Synapex Mission Text" },
  { key: "synapex_tagline", label: "Synapex Tagline" },
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
    const keys = [...settingsKeys.map((k) => k.key), "profile_image_url"];
    for (const key of keys) {
      if (form[key] !== undefined) {
        await supabase.from("site_settings").upsert({ key, value: form[key] || "" });
      }
    }
    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    toast({ title: "Settings saved!" });
    setSaving(false);
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
      </div>
    </div>
  );
};

export default AdminSettings;
