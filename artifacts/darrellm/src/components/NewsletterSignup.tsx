import { FormEvent, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const NewsletterSignup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setStatus("error");
      return;
    }
    setSending(true);
    setStatus("idle");
    try {
      await api.subscribeNewsletter(normalized);
      setEmail("");
      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      toast({ title: "Subscription failed", description: error?.message || "Try again later.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id="newsletter"
      className="section-padding pt-0"
    >
      <div className="newsletter-panel">
        <div className="flex items-start gap-4">
          <span className="newsletter-icon"><Mail className="w-5 h-5" /></span>
          <div>
            <p className="eyebrow mb-2">// occasional notes</p>
            <h2 className="display-font text-2xl md:text-3xl font-bold tracking-tight">No noise. Just the good stuff.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
              Build notes, useful links, and new posts when there is something worth sharing.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col sm:flex-row gap-2.5">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }}
            placeholder="you@example.com"
            maxLength={255}
            autoComplete="email"
            className="newsletter-input"
            aria-invalid={status === "error"}
            required
          />
          <button type="submit" disabled={sending} className="newsletter-button pressable">
            {sending ? "Joining..." : "Subscribe"}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-muted-foreground mt-3">
          Unsubscribe anytime. Your address is only used for these notes.
        </p>
        {status === "success" && (
          <p role="status" className="text-sm text-primary mt-4">
            You’re on the list. The next note will arrive when there’s something worth sharing.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-sm text-destructive mt-4">
            Enter a valid email address to subscribe.
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default NewsletterSignup;