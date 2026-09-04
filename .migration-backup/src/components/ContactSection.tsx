import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/use-site-data";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MapPin } from "lucide-react";

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
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: form.name.trim().slice(0, 100),
          email: form.email.trim().slice(0, 255),
          message: form.message.trim().slice(0, 4000),
        },
      });
      if (error) throw error;
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
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">// contact</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Have a project idea, want to collaborate, or just want to chat? I'm always open to new opportunities.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-muted-foreground">{settings?.email || "darrell@example.com"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-muted-foreground">{settings?.location || "Zimbabwe"}</span>
              </div>
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors" />
            <input type="email" placeholder="Email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors" />
            <textarea placeholder="Message" rows={4} maxLength={4000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none" />
            <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium text-sm rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50">
              {sending ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
