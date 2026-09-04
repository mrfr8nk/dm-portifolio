import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWhatIBuild } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminWhatIBuild = () => {
  const { data: items, isLoading } = useWhatIBuild();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (item: any) => {
    setEditId(item.id);
    setForm({ title: item.title, purpose: item.purpose, tech: (item.tech || []).join(", "), impact: item.impact || "", icon_name: item.icon_name || "cog", sort_order: item.sort_order || 0 });
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      purpose: form.purpose,
      tech: form.tech.split(",").map((s: string) => s.trim()).filter(Boolean),
      impact: form.impact,
      icon_name: form.icon_name,
      sort_order: Number(form.sort_order),
    };
    if (editId === "new") {
      await supabase.from("what_i_build").insert(payload);
    } else {
      await supabase.from("what_i_build").update(payload).eq("id", editId);
    }
    queryClient.invalidateQueries({ queryKey: ["what_i_build"] });
    toast({ title: "Saved!" });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("what_i_build").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["what_i_build"] });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ title: "", purpose: "", tech: "", impact: "", icon_name: "cog", sort_order: 0 });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">What I Build</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Icon name" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <textarea placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} rows={2} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 resize-none" />
          <input placeholder="Tech (comma separated)" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <input placeholder="Impact" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <div className="flex gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90"><Save className="w-4 h-4" /> Save</button>
            <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items?.map((item) => (
          <div key={item.id} className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">{(item.tech || []).join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWhatIBuild;
