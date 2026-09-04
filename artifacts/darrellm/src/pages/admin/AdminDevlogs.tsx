import { useState } from "react";
import { Plus, Save, Trash2, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useDevlogs } from "@/hooks/use-site-data";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  title: "", excerpt: "", content: "", tags: "", status: "shipping",
  published_at: new Date().toISOString().slice(0, 10), is_published: true,
};

const AdminDevlogs = () => {
  const { data: rawDevlogs, isLoading } = useDevlogs();
  const devlogs = rawDevlogs as any[] | undefined;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const startEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      title: item.title || "", excerpt: item.excerpt || "", content: item.content || "",
      tags: (item.tags || []).join(", "), status: item.status || "shipping",
      published_at: (item.published_at || item.publishedAt || "").slice(0, 10),
      is_published: item.is_published !== false,
    });
  };

  const save = async () => {
    const payload = {
      title: form.title.trim(), excerpt: form.excerpt.trim(), content: form.content.trim(),
      tags: form.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
      status: form.status.trim() || "shipping",
      published_at: form.published_at ? new Date(`${form.published_at}T12:00:00`).toISOString() : new Date().toISOString(),
      is_published: form.is_published,
    };
    try {
      if (editId === "new") await api.createDevlog(payload);
      else await api.updateDevlog(editId!, payload);
      queryClient.invalidateQueries({ queryKey: ["devlogs"] });
      setEditId(null);
      toast({ title: "Devlog saved" });
    } catch (error: any) {
      toast({ title: "Save failed", description: error?.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    try {
      await api.deleteDevlog(id);
      queryClient.invalidateQueries({ queryKey: ["devlogs"] });
      toast({ title: "Devlog deleted" });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error?.message, variant: "destructive" });
    }
  };

  const togglePublished = async (item: any) => {
    await api.updateDevlog(item.id, { is_published: !item.is_published });
    queryClient.invalidateQueries({ queryKey: ["devlogs"] });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h1 className="text-xl font-bold">Devlogs</h1>
          <p className="text-sm text-muted-foreground mt-1">Short build notes that sit between a tweet and a full post.</p>
        </div>
        <button type="button" onClick={() => { setEditId("new"); setForm({ ...emptyForm }); }} className="admin-primary-button">
          <Plus className="w-4 h-4" /> New devlog
        </button>
      </div>

      {editId && (
        <div className="admin-editor">
          <h2 className="font-bold text-sm">{editId === "new" ? "New devlog" : "Edit devlog"}</h2>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" />
          <input placeholder="Status label, e.g. shipping or thinking" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="admin-input" />
          <input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className="admin-input" />
          <textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="admin-input resize-none" />
          <textarea placeholder="Full update" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="admin-input resize-y font-mono" />
          <input placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="admin-input" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published on the portfolio
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={save} className="admin-primary-button"><Save className="w-4 h-4" /> Save</button>
            <button type="button" onClick={() => setEditId(null)} className="admin-secondary-button">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {devlogs?.map((item) => (
          <div key={item.id} className="admin-list-row">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{item.title} {!item.is_published && <span className="admin-muted-label">(draft)</span>}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{item.status || "build note"} · {item.published_at?.slice(0, 10)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button type="button" onClick={() => togglePublished(item)} className="text-muted-foreground hover:text-foreground" title={item.is_published ? "Unpublish" : "Publish"}>
                {item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => startEdit(item)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button type="button" onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Delete ${item.title}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!devlogs?.length && <p className="admin-empty-state">No saved devlogs yet. Starter notes stay public-only until you add your own.</p>}
      </div>
    </div>
  );
};

export default AdminDevlogs;