import { api } from "@/lib/api";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminEducation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const { data: items, isLoading } = useQuery({
    queryKey: ["education"],
    queryFn: () => api.getEducation(),
  });

  const startEdit = (e: any) => {
    setEditId(e.id);
    setForm({
      level: e.level,
      school: e.school,
      period: e.period,
      status: e.status || "",
      description: e.description || "",
      icon_name: e.icon_name || "graduation-cap",
      is_highlight: !!e.is_highlight,
      sort_order: e.sort_order || 0,
      results: Array.isArray(e.results) ? e.results : [],
    });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ level: "", school: "", period: "", status: "", description: "", icon_name: "graduation-cap", is_highlight: false, sort_order: 0, results: [] });
  };

  const handleSave = async () => {
    const payload = { ...form, sortOrder: Number(form.sort_order), isHighlight: form.is_highlight };
    if (editId === "new") await api.createEducation(payload);
    else await api.updateEducation(editId!, payload);
    queryClient.invalidateQueries({ queryKey: ["education"] });
    toast({ title: "Saved!" });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    await api.deleteEducation(id);
    queryClient.invalidateQueries({ queryKey: ["education"] });
  };

  const addResult = () => setForm({ ...form, results: [...(form.results || []), { subject: "", grade: "" }] });
  const updateResult = (i: number, key: "subject" | "grade", val: string) => {
    const r = [...form.results];
    r[i] = { ...r[i], [key]: val };
    setForm({ ...form, results: r });
  };
  const removeResult = (i: number) => setForm({ ...form, results: form.results.filter((_: any, idx: number) => idx !== i) });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Education</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Level (e.g. A Level)" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="School" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Period (e.g. 2021 — 2024)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Status (e.g. Completed — 8A 1B 2C)" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Icon (graduation-cap, school, book-open, atom)" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_highlight} onChange={(e) => setForm({ ...form, is_highlight: e.target.checked })} /> Highlight (featured card)
          </label>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Subjects & Grades</p>
              <button onClick={addResult} className="text-xs text-foreground inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add subject</button>
            </div>
            <div className="space-y-2">
              {form.results?.map((r: any, i: number) => (
                <div key={i} className="flex gap-2">
                  <input placeholder="Subject" value={r.subject} onChange={(e) => updateResult(i, "subject", e.target.value)} className="flex-1 bg-transparent border border-border rounded-md px-3 py-2 text-sm" />
                  <input placeholder="Grade" value={r.grade} onChange={(e) => updateResult(i, "grade", e.target.value)} className="w-32 bg-transparent border border-border rounded-md px-3 py-2 text-sm" />
                  <button onClick={() => removeResult(i)} className="text-destructive px-2"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90"><Save className="w-4 h-4" /> Save</button>
            <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items?.map((e) => (
          <div key={e.id} className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{e.level} — {e.school}</p>
              <p className="text-xs text-muted-foreground font-mono">{e.period} · {e.status}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(e)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(e.id)} className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEducation;
