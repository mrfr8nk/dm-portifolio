import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

const ImageUpload = ({ value, onChange, folder = "uploads", label = "Image" }: Props) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    onChange(data.publicUrl);
    toast({ title: "Uploaded!" });
    setUploading(false);
  };

  return (
    <div>
      <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange("")} className="absolute top-0 right-0 bg-background/80 p-0.5 rounded-bl">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm cursor-pointer hover:bg-accent transition-colors">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Choose file"}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
        {value && <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent border border-border rounded-md px-3 py-2 text-xs font-mono text-muted-foreground" />}
      </div>
    </div>
  );
};

export default ImageUpload;
