import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const empty = {
  title: "", issuer: "", issue_date: "", credential_id: "", credential_url: "",
  image_url: "", description: "", skills: [] as string[], is_visible: true, sort_order: 0,
};

const AdminCertifications = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [skillsInput, setSkillsInput] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin_certifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certifications" as any).select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const startEdit = (c: any) => {
    setEditId(c.id);
    setForm({ ...empty, ...c });
    setSkillsInput((c.skills || []).join(", "));
  };
  const handleAdd = () => {
    setEditId("new");
    setForm(empty);
    setSkillsInput("");
  };
  const handleSave = async () => {
    const payload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
      skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const op = editId === "new"
      ? supabase.from("certifications" as any).insert(payload)
      : supabase.from("certifications" as any).update(payload).eq("id", editId);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    qc.invalidateQueries({ queryKey: ["admin_certifications"] });
    qc.invalidateQueries({ queryKey: ["certifications", true] });
    toast({ title: "Saved!" });
    setEditId(null);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    await supabase.from("certifications" as any).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_certifications"] });
    qc.invalidateQueries({ queryKey: ["certifications", true] });
  };
  const toggleVisible = async (c: any) => {
    await supabase.from("certifications" as any).update({ is_visible: !c.is_visible }).eq("id", c.id);
    qc.invalidateQueries({ queryKey: ["admin_certifications"] });
    qc.invalidateQueries({ queryKey: ["certifications", true] });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const inp = "bg-transparent border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 w-full";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Certifications</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage verified credentials shown on your portfolio.</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editId && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Title (e.g. Google Cybersecurity)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} />
            <input placeholder="Issuer (e.g. Coursera, Microsoft)" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className={inp} />
            <input placeholder="Issue date (e.g. Mar 2025)" value={form.issue_date || ""} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className={inp} />
            <input placeholder="Credential ID (optional)" value={form.credential_id || ""} onChange={(e) => setForm({ ...form, credential_id: e.target.value })} className={inp} />
            <input placeholder="Credential URL (https://…)" value={form.credential_url || ""} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} className={`${inp} col-span-2`} />
            <input placeholder="Badge image URL (optional)" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={`${inp} col-span-2`} />
            <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className={inp} />
            <label className="flex items-center gap-2 text-sm px-2">
              <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} /> Visible on site
            </label>
          </div>
          <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inp} />
          <input placeholder="Skills (comma separated, e.g. Networking, SQL, Python)" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} className={inp} />

          <div className="flex gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90"><Save className="w-4 h-4" /> Save</button>
            <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items?.length ? items.map((c) => (
          <div key={c.id} className="border border-border rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{c.title}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{c.issuer} · {c.issue_date || "—"}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => toggleVisible(c)} className="text-muted-foreground hover:text-foreground" title={c.is_visible ? "Hide" : "Show"}>
                {c.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(c)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )) : <p className="text-sm text-muted-foreground">No certifications yet. Click Add to create one.</p>}
      </div>
    </div>
  );
};

export default AdminCertifications;
