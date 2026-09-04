import { useState } from "react";
import { api } from "@/lib/api";
import { Upload, X, Loader2, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
  helperText?: string;
}

const ImageUpload = ({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  accept = "image/*",
  helperText,
}: Props) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const visualPreview = accept.includes("image");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file, folder);
      onChange(url);
      toast({ title: "Uploaded!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message || "Try again", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          visualPreview ? (
            <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border shrink-0">
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange("")} aria-label={`Remove ${label}`} className="absolute top-0 right-0 bg-background/80 p-0.5 rounded-bl">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground min-w-0">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <a href={value} target="_blank" rel="noopener noreferrer" className="truncate hover:text-foreground">
                Uploaded file
              </a>
              <ExternalLink className="w-3 h-3 shrink-0" />
              <button type="button" onClick={() => onChange("")} aria-label={`Remove ${label}`} className="p-0.5 hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
           )
        )}
        <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm cursor-pointer hover:bg-accent transition-colors">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Choose file"}
          <input type="file" accept={accept} onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
        {value && (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent border border-border rounded-md px-3 py-2 text-xs font-mono text-muted-foreground"
          />
        )}
      </div>
      {helperText && <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
};

export default ImageUpload;
