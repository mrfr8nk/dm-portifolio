import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminInbox = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: () => api.getContactMessages(),
  });

  const toggleRead = async (id: string, isRead: boolean) => {
    await api.updateContactMessage(id, { isRead: !isRead });
    qc.invalidateQueries({ queryKey: ["contact_messages"] });
  };

  const remove = async (id: string) => {
    await api.deleteContactMessage(id);
    qc.invalidateQueries({ queryKey: ["contact_messages"] });
    toast({ title: "Message deleted" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const unread = data?.filter((m) => !m.is_read).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Inbox</h1>
        <span className="font-mono text-xs text-muted-foreground">{unread} unread / {data?.length || 0} total</span>
      </div>

      <div className="space-y-3">
        {data?.map((m) => (
          <div key={m.id} className={`border rounded-lg p-5 ${m.is_read ? "border-border" : "border-foreground/30 bg-secondary/30"}`}>
            <div className="flex items-start justify-between mb-2 gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm">{m.name} <span className="text-muted-foreground font-mono text-xs">&lt;{m.email}&gt;</span></p>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleRead(m.id, m.is_read)} className="text-muted-foreground hover:text-foreground" title={m.is_read ? "Mark unread" : "Mark read"}>
                  {m.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(m.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed mt-3">{m.message}</p>
            <a href={`mailto:${m.email}?subject=Re: your message`} className="inline-block mt-3 text-xs font-mono text-muted-foreground hover:text-foreground">
              reply →
            </a>
          </div>
        ))}
        {!data?.length && <p className="text-sm text-muted-foreground">No messages yet.</p>}
      </div>
    </div>
  );
};

export default AdminInbox;
