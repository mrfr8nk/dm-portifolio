import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  category: string;
  name: string;
  percentage: number;
  icon_slug: string | null;
  sort_order: number | null;
}

const CATEGORIES = ["frontend", "backend", "database", "languages", "devops", "mobile", "ai"];

const empty = { category: "frontend", name: "", percentage: 70, icon_slug: "", sort_order: 0 };

const AdminSkills = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin_skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills" as any).select("*").order("category").order("sort_order");
      if (error) throw error;
      return (data as unknown as Skill[]) ?? [];
    },
  });

  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { if (data) setItems(data); }, [data]);

  const update = (i: number, patch: Partial<Skill>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const add = () => setItems((p) => [...p, { ...empty, id: `new-${Date.now()}` }]);

  const remove = async (i: number) => {
    const it = items[i];
    if (it.id && !String(it.id).startsWith("new-")) {
      await supabase.from("skills" as any).delete().eq("id", it.id);
    }
    setItems((p) => p.filter((_, idx) => idx !== i));
    qc.invalidateQueries({ queryKey: ["admin_skills"] });
    qc.invalidateQueries({ queryKey: ["skills"] });
  };

  const save = async () => {
    for (const it of items) {
      const payload = {
        category: it.category,
        name: it.name,
        percentage: Number(it.percentage) || 0,
        icon_slug: it.icon_slug || null,
        sort_order: Number(it.sort_order) || 0,
      };
      if (String(it.id).startsWith("new-")) {
        await supabase.from("skills" as any).insert(payload);
      } else {
        await supabase.from("skills" as any).update(payload).eq("id", it.id);
      }
    }
    qc.invalidateQueries({ queryKey: ["admin_skills"] });
    qc.invalidateQueries({ queryKey: ["skills"] });
    toast({ title: "Skills saved!" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Skills</h1>
        <div className="flex gap-2">
          <button onClick={add} className="inline-flex items-center gap-2 px-3 py-2 border border-border text-sm rounded-md hover:bg-secondary">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={it.id} className="border border-border rounded-md p-4 grid grid-cols-12 gap-3 items-center">
            <select
              value={it.category}
              onChange={(e) => update(i, { category: e.target.value })}
              className="col-span-3 bg-transparent border border-border rounded px-2 py-2 text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              placeholder="Name (e.g. React)"
              value={it.name}
              onChange={(e) => update(i, { name: e.target.value })}
              className="col-span-3 bg-transparent border border-border rounded px-2 py-2 text-sm"
            />
            <input
              placeholder="icon slug (optional, e.g. react)"
              value={it.icon_slug || ""}
              onChange={(e) => update(i, { icon_slug: e.target.value })}
              className="col-span-3 bg-transparent border border-border rounded px-2 py-2 text-sm font-mono"
            />
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={it.percentage}
                onChange={(e) => update(i, { percentage: Number(e.target.value) })}
                className="flex-1"
              />
              <span className="font-mono text-xs w-10 text-right">{it.percentage}%</span>
            </div>
            <button onClick={() => remove(i)} className="col-span-1 text-muted-foreground hover:text-destructive justify-self-end">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {!items.length && <p className="text-sm text-muted-foreground">No skills yet. Click Add to create one.</p>}
      </div>
    </div>
  );
};

export default AdminSkills;
