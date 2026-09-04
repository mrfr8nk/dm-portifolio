import { api } from "@/lib/api";
import { useState } from "react";
import { useBlogPosts } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const AdminBlog = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || "",
      content: p.content,
      cover_image_url: p.cover_image_url || "",
      tags: (p.tags || []).join(", "),
      is_published: p.is_published,
    });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: "", is_published: true });
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      tags: form.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
      is_published: form.is_published,
    };
    try {
      if (editId === "new") await api.createBlogPost(payload);
      else await api.updateBlogPost(editId!, payload);
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
      toast({ title: "Post saved!" });
      setEditId(null);
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteBlogPost(id);
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    toast({ title: "Post deleted" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Blog</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <h2 className="font-bold text-sm">{editId === "new" ? "New Post" : "Edit Post"}</h2>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <input placeholder="slug-here" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-foreground/30" />
          <textarea placeholder="Excerpt (short summary)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 resize-none" />
          <ImageUpload value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} folder="blog" label="Cover Image (optional)" />
          <textarea placeholder="Content (supports plain text / markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 resize-y font-mono" />
          <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
          <div className="flex gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {posts?.map((p) => (
          <div key={p.id} className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{p.title} {!p.is_published && <span className="text-xs text-muted-foreground font-mono ml-2">(draft)</span>}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">/{p.slug}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-xs text-destructive hover:text-destructive/80">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;
