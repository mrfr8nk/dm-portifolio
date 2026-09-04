import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number;
  is_visible: boolean;
  sort_order: number | null;
}

const empty = {
  name: "",
  role: "",
  company: "",
  quote: "",
  avatar_url: "",
  rating: 5,
  is_visible: true,
  sort_order: 0,
};

const AdminTestimonials = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin_testimonials"],
    queryFn: () => api.getTestimonials(),
  });

  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { if (data) setItems(data); }, [data]);

  const update = (i: number, patch: Partial<Testimonial>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const add = () => setItems((p) => [...p, { ...empty, id: `new-${Date.now()}` }]);

  const remove = async (i: number) => {
    const it = items[i];
    if (it.id && !String(it.id).startsWith("new-")) {
      await api.deleteTestimonial(it.id);
    }
    setItems((p) => p.filter((_, idx) => idx !== i));
    qc.invalidateQueries({ queryKey: ["admin_testimonials"] });
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };

  const save = async () => {
    for (const it of items) {
      if (!it.name?.trim() || !it.quote?.trim()) continue;
      const payload = {
        name: it.name,
        role: it.role || null,
        company: it.company || null,
        quote: it.quote,
        avatarUrl: it.avatar_url || null,
        rating: Math.min(5, Math.max(1, Number(it.rating) || 5)),
        isVisible: !!it.is_visible,
        sortOrder: Number(it.sort_order) || 0,
      };
      if (String(it.id).startsWith("new-")) {
        await api.createTestimonial(payload);
      } else {
        await api.updateTestimonial(it.id, payload);
      }
    }
    qc.invalidateQueries({ queryKey: ["admin_testimonials"] });
    qc.invalidateQueries({ queryKey: ["testimonials"] });
    toast({ title: "Testimonials saved!" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Testimonials</h1>
        <div className="flex gap-2">
          <button onClick={add} className="inline-flex items-center gap-2 px-3 py-2 border border-border text-sm rounded-md hover:bg-secondary">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={it.id} className="border border-border rounded-lg p-5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                placeholder="Name *"
                value={it.name}
                onChange={(e) => update(i, { name: e.target.value })}
                className="bg-transparent border border-border rounded px-3 py-2 text-sm"
              />
              <input
                placeholder="Role (e.g. CTO)"
                value={it.role || ""}
                onChange={(e) => update(i, { role: e.target.value })}
                className="bg-transparent border border-border rounded px-3 py-2 text-sm"
              />
              <input
                placeholder="Company"
                value={it.company || ""}
                onChange={(e) => update(i, { company: e.target.value })}
                className="bg-transparent border border-border rounded px-3 py-2 text-sm"
              />
            </div>

            <textarea
              placeholder="Quote *"
              value={it.quote}
              onChange={(e) => update(i, { quote: e.target.value })}
              rows={3}
              className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <ImageUpload
                value={it.avatar_url}
                onChange={(url) => update(i, { avatar_url: url })}
                folder="testimonials"
                label="Avatar"
              />
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Rating</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range" min={1} max={5}
                      value={it.rating}
                      onChange={(e) => update(i, { rating: Number(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="font-mono text-sm w-10 text-right">{it.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Sort order</label>
                  <input
                    type="number"
                    value={it.sort_order ?? 0}
                    onChange={(e) => update(i, { sort_order: Number(e.target.value) })}
                    className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={() => update(i, { is_visible: !it.is_visible })}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {it.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {it.is_visible ? "Visible on site" : "Hidden"}
              </button>
              <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-muted-foreground">No testimonials yet. Click Add to create one.</p>}
      </div>
    </div>
  );
};

export default AdminTestimonials;
