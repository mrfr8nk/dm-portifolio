import { api } from "@/lib/api";
import { useState } from "react";
import { useMilestones } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminMilestones = () => {
  const { data: milestones, isLoading } = useMilestones();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (m: any) => {
    setEditId(m.id);
    setForm({ year: m.year, title: m.title, description: m.description, icon_name: m.icon_name || "code", is_highlight: m.is_highlight ?? false, sort_order: m.sort_order || 0 });
  };

  const handleSave = async () => {
    const payload = { ...form, sortOrder: Number(form.sort_order) };
    if (editId === "new") await api.createMilestone(payload);
    else await api.updateMilestone(editId!, payload);
    queryClient.invalidateQueries({ queryKey: ["milestones"] });
    toast({ title: "Milestone saved!" });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    await api.deleteMilestone(id);
    queryClient.invalidateQueries({ queryKey: ["milestones"] });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ year: "", title: "", description: "", icon_name: "code", is_highlight: false, sort_order: 0 });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Milestones</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Icon name" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 resize-none" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_highlight} onChange={(e) => setForm({ ...form, is_highlight: e.target.checked })} />
            Highlight
          </label>
          <div className="flex gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90"><Save className="w-4 h-4" /> Save</button>
            <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {milestones?.map((m) => (
          <div key={m.id} className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{m.year} — {m.title}</p>
              <p className="text-xs text-muted-foreground">{m.description.slice(0, 60)}...</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(m)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="text-xs text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMilestones;
