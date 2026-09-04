import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSocialLinks } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSocial = () => {
  const { data: links, isLoading } = useSocialLinks();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (l: any) => {
    setEditId(l.id);
    setForm({ platform: l.platform, url: l.url, icon_name: l.icon_name, sort_order: l.sort_order || 0 });
  };

  const handleSave = async () => {
    const payload = { ...form, sort_order: Number(form.sort_order) };
    if (editId === "new") {
      await supabase.from("social_links").insert(payload);
    } else {
      await supabase.from("social_links").update(payload).eq("id", editId);
    }
    queryClient.invalidateQueries({ queryKey: ["social_links"] });
    toast({ title: "Saved!" });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("social_links").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["social_links"] });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ platform: "", url: "", icon_name: "github", sort_order: 0 });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Social Links</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Platform" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Icon (github/twitter/linkedin)" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Sort order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <div className="flex gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90"><Save className="w-4 h-4" /> Save</button>
            <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links?.map((l) => (
          <div key={l.id} className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{l.platform}</p>
              <p className="text-xs text-muted-foreground font-mono">{l.url}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(l)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(l.id)} className="text-xs text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSocial;
