import { api } from "@/lib/api";
import { useState } from "react";
import { useCurrentlyBuilding } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCurrently = () => {
  const { data: items, isLoading } = useCurrentlyBuilding();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (item: any) => {
    setEditId(item.id);
    setForm({ category: item.category, icon_name: item.icon_name || "hammer", items: (item.items || []).join("\n"), sort_order: item.sort_order || 0 });
  };

  const handleSave = async () => {
    const payload = {
      category: form.category,
      icon_name: form.icon_name,
      items: form.items.split("\n").map((s: string) => s.trim()).filter(Boolean),
      sort_order: Number(form.sort_order),
    };
    if (editId === "new") await api.createCurrentlyBuilding(payload);
    else await api.updateCurrentlyBuilding(editId!, payload);
    queryClient.invalidateQueries({ queryKey: ["currently_building"] });
    toast({ title: "Saved!" });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    await api.deleteCurrentlyBuilding(id);
    queryClient.invalidateQueries({ queryKey: ["currently_building"] });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ category: "", icon_name: "hammer", items: "", sort_order: 0 });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Currently Building</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Category (e.g. Building)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Icon name" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <textarea placeholder="Items (one per line)" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} rows={4} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 resize-none" />
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
              <p className="font-medium text-sm">{item.category}</p>
              <p className="text-xs text-muted-foreground">{(item.items || []).length} items</p>
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

export default AdminCurrently;
