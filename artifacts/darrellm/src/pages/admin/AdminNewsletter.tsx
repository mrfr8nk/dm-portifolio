import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Mail, Trash2, UserRoundCheck, UserRoundX } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminNewsletter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["newsletter_subscriptions"],
    queryFn: api.getNewsletterSubscriptions,
  });

  const toggleStatus = async (item: any) => {
    await api.updateNewsletterSubscription(item.id, item.status === "active" ? "unsubscribed" : "active");
    queryClient.invalidateQueries({ queryKey: ["newsletter_subscriptions"] });
  };

  const remove = async (id: string) => {
    await api.deleteNewsletterSubscription(id);
    queryClient.invalidateQueries({ queryKey: ["newsletter_subscriptions"] });
    toast({ title: "Subscriber removed" });
  };

  const exportCsv = () => {
    const rows = (subscribers || []).map((item: any) => [item.email, item.status, item.subscribed_at || "", item.last_subscribed_at || ""]);
    const csv = [["email", "status", "subscribed_at", "last_subscribed_at"], ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, "\"\"")}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;
  const active = subscribers?.filter((item: any) => item.status === "active").length || 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h1 className="text-xl font-bold">Newsletter</h1>
          <p className="text-sm text-muted-foreground mt-1">{active} active subscriber{active === 1 ? "" : "s"} · {subscribers?.length || 0} total records</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={!subscribers?.length} className="admin-secondary-button disabled:opacity-40"><Download className="w-4 h-4" /> Export CSV</button>
      </div>

      <div className="newsletter-admin-note">
        <Mail className="w-4 h-4 text-primary shrink-0" />
        <p>Subscribers are collected with consent. This area manages the list; it does not send campaigns automatically.</p>
      </div>

      <div className="space-y-2">
        {subscribers?.map((item: any) => (
          <div key={item.id} className="admin-list-row">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {item.status === "active" ? <UserRoundCheck className="w-4 h-4" /> : <UserRoundX className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <a href={`mailto:${item.email}`} className="font-medium text-sm hover:text-primary truncate block">{item.email}</a>
                <p className="text-xs text-muted-foreground font-mono">{item.status} · {new Date(item.subscribed_at || item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button type="button" onClick={() => toggleStatus(item)} className="text-xs text-muted-foreground hover:text-foreground">{item.status === "active" ? "Unsubscribe" : "Reactivate"}</button>
              <button type="button" onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Delete ${item.email}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!subscribers?.length && <p className="admin-empty-state">No newsletter subscribers yet.</p>}
      </div>
    </div>
  );
};

export default AdminNewsletter;