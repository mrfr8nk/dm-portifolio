import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/use-site-data";
import { api } from "@/lib/api";

const ContactSection = () => {
  const { toast } = useToast();
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: "Invalid email address.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await api.createContactMessage({
        name: form.name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 255),
        message: form.message.trim().slice(0, 4000),
      });
      toast({ title: "Message sent!", description: "I'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast({ title: "Failed to send", description: err?.message || "Try again later.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="eyebrow mb-3">// contact</p>
          <h2 className="display-font text-4xl md:text-5xl font-bold mb-4 tracking-tight">Let's make something useful.</h2>
          <div className="section-rule" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Have a project idea, want to collaborate, or just want to chat? I'm always open to new opportunities.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${settings?.email || "darrell@example.com"}`} className="font-mono text-sm text-muted-foreground link-underline">
                  {settings?.email || "darrell@example.com"}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-muted-foreground">{settings?.location || "Zimbabwe"}</span>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              aria-label="Name"
              data-testid="input-contact-name"
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              data-testid="input-contact-email"
              maxLength={255}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
            />
            <textarea
              placeholder="Message"
              aria-label="Message"
              data-testid="input-contact-message"
              rows={4}
              maxLength={4000}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              data-testid="button-send-message"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium text-sm rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 pressable"
            >
              {sending ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
