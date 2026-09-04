import { useState } from "react";
import { Plus, Save, Trash2, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useFriends } from "@/hooks/use-site-data";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

const emptyForm = {
  name: "", relationship: "", role: "", context: "", url: "", avatar_url: "",
  sort_order: 0, is_published: true,
};

const AdminFriends = () => {
  const { data: rawFriends, isLoading } = useFriends();
  const friends = rawFriends as any[] | undefined;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const startEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      name: item.name || "", relationship: item.relationship || "", role: item.role || "",
      context: item.context || "", url: item.url || "", avatar_url: item.avatar_url || "",
      sort_order: item.sort_order || 0, is_published: item.is_published !== false,
    });
  };

  const save = async () => {
    const payload = {
      name: form.name.trim(), relationship: form.relationship.trim(), role: form.role.trim(),
      context: form.context.trim(), url: form.url.trim() || null, avatar_url: form.avatar_url || null,
      sort_order: Number(form.sort_order) || 0, is_published: form.is_published,
    };
    try {
      if (editId === "new") await api.createFriend(payload);
      else await api.updateFriend(editId!, payload);
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      setEditId(null);
      toast({ title: "Friend saved" });
    } catch (error: any) {
      toast({ title: "Save failed", description: error?.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    await api.deleteFriend(id);
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    toast({ title: "Friend removed" });
  };

  const togglePublished = async (item: any) => {
    await api.updateFriend(item.id, { is_published: !item.is_published });
    queryClient.invalidateQueries({ queryKey: ["friends"] });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h1 className="text-xl font-bold">Friends</h1>
          <p className="text-sm text-muted-foreground mt-1">People you learn from, build with, and recommend.</p>
        </div>
        <button type="button" onClick={() => { setEditId("new"); setForm({ ...emptyForm }); }} className="admin-primary-button"><Plus className="w-4 h-4" /> Add friend</button>
      </div>

      {editId && (
        <div className="admin-editor">
          <h2 className="font-bold text-sm">{editId === "new" ? "Add friend" : "Edit friend"}</h2>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Relationship, e.g. collaborator" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} className="admin-input" />
            <input placeholder="Role or specialty (optional)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="admin-input" />
          </div>
          <input placeholder="Context, e.g. DevsU community" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} className="admin-input" />
          <input type="url" placeholder="Profile URL (optional)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="admin-input" />
          <ImageUpload value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} folder="friends" label="Avatar (optional)" />
          <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="admin-input" />
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
        {friends?.map((item) => (
          <div key={item.id} className="admin-list-row">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-mono shrink-0">{item.name?.split(/\s+/).map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{item.name} {!item.is_published && <span className="admin-muted-label">(hidden)</span>}</p>
                <p className="text-xs text-muted-foreground truncate">{item.relationship || item.role || "friend"}{item.context ? ` · ${item.context}` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button type="button" onClick={() => togglePublished(item)} className="text-muted-foreground hover:text-foreground" title={item.is_published ? "Hide" : "Show"}>{item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
              <button type="button" onClick={() => startEdit(item)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button type="button" onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Delete ${item.name}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!friends?.length && <p className="admin-empty-state">No friends added yet. Add only people and links you want to publish.</p>}
      </div>
    </div>
  );
};

export default AdminFriends;