import { api } from "@/lib/api";
import { useState } from "react";
import { useFooterLinks } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminFooter = () => {
  const { data: links, isLoading } = useFooterLinks();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (l: any) => {
    setEditId(l.id);
    setForm({ section: l.section, label: l.label, href: l.href, sort_order: l.sort_order || 0 });
  };

  const handleSave = async () => {
    const payload = { ...form, sort_order: Number(form.sort_order) };
    if (editId === "new") await api.createFooterLink(payload);
    else await api.updateFooterLink(editId!, payload);
    queryClient.invalidateQueries({ queryKey: ["footer_links"] });
    toast({ title: "Saved!" });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    await api.deleteFooterLink(id);
    queryClient.invalidateQueries({ queryKey: ["footer_links"] });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ section: "", label: "", href: "#", sort_order: 0 });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Footer Links</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Section (Navigate/Projects/Startup)" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <input placeholder="Link (e.g. #projects)" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
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
              <p className="font-medium text-sm">{l.section} / {l.label}</p>
              <p className="text-xs text-muted-foreground font-mono">{l.href}</p>
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

export default AdminFooter;
