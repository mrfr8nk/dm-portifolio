import { api } from "@/lib/api";
import { useState } from "react";
import { useProjects } from "@/hooks/use-site-data";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

const AdminProjects = () => {
  const { data: projects, isLoading } = useProjects();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      impact: p.impact || "",
      tech: (p.tech || []).join(", "),
      icon_name: p.icon_name || "bot",
      sort_order: p.sort_order || 0,
      is_featured: p.is_featured ?? true,
      is_visible: p.is_visible ?? true,
      image_url: p.image_url || "",
      demo_url: p.demo_url || "",
      source_url: p.source_url || "",
      cs_problem: p.case_study?.problem || "",
      cs_thought: p.case_study?.thought || "",
      cs_techReason: p.case_study?.techReason || "",
      cs_challenges: p.case_study?.challenges || "",
      cs_solution: p.case_study?.solution || "",
      cs_result: p.case_study?.result || "",
    });
  };

  const handleSave = async () => {
    const case_study = {
      problem: form.cs_problem,
      thought: form.cs_thought,
      techReason: form.cs_techReason,
      challenges: form.cs_challenges,
      solution: form.cs_solution,
      result: form.cs_result,
    };
    const payload = {
      title: form.title,
      description: form.description,
      impact: form.impact,
      tech: form.tech.split(",").map((s: string) => s.trim()).filter(Boolean),
      icon_name: form.icon_name,
      sort_order: Number(form.sort_order),
      is_featured: form.is_featured,
      is_visible: form.is_visible,
      image_url: form.image_url || null,
      demo_url: form.demo_url || null,
      source_url: form.source_url || null,
      case_study,
    };

    try {
      if (editId === "new") await api.createProject(payload);
      else await api.updateProject(editId!, payload);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Project saved!" });
      setEditId(null);
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteProject(id);
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    toast({ title: "Project deleted" });
  };

  const toggleVisible = async (p: any) => {
    await api.updateProject(p.id, { isVisible: !p.is_visible });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const handleAdd = () => {
    setEditId("new");
    setForm({ title: "", description: "", impact: "", tech: "", icon_name: "bot", sort_order: 0, is_featured: true, is_visible: true, image_url: "", demo_url: "", source_url: "", cs_problem: "", cs_thought: "", cs_techReason: "", cs_challenges: "", cs_solution: "", cs_result: "" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Projects</h1>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <h2 className="font-bold text-sm">{editId === "new" ? "New Project" : "Edit Project"}</h2>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 resize-none" />
          <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="projects" label="Project Image (optional)" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Impact" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Icon name" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <input placeholder="Tech (comma separated, e.g. React, Node.js, Python)" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Live demo URL (optional)" value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
            <input placeholder="Source code URL (optional)" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} className="bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
            Visible on home
          </label>

          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mt-4">Case Study</p>
          {["problem", "thought", "techReason", "challenges", "solution", "result"].map((field) => (
            <textarea key={field} placeholder={field} value={form[`cs_${field}`]} onChange={(e) => setForm({ ...form, [`cs_${field}`]: e.target.value })} rows={2} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 resize-none" />
          ))}

          <div className="flex gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {projects?.map((p) => (
          <div key={p.id} className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{p.title} {!p.is_visible && <span className="text-xs text-muted-foreground font-mono ml-2">(hidden)</span>}</p>
              <p className="text-xs text-muted-foreground truncate">{(p.tech || []).join(", ")}</p>
            </div>
            <div className="flex gap-3 shrink-0 items-center">
              <button onClick={() => toggleVisible(p)} className="text-muted-foreground hover:text-foreground" title={p.is_visible ? "Hide" : "Show"}>
                {p.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
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

export default AdminProjects;
