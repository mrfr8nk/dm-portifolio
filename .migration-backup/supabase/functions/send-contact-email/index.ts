import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Payload {
  name: string;
  email: string;
  message: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    const name = (body.name || "").trim().slice(0, 100);
    const email = (body.email || "").trim().slice(0, 255);
    const message = (body.message || "").trim().slice(0, 4000);

    if (!name || !email || !message) return json({ error: "Missing required fields" }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email" }, 400);

    // 1. Save to DB (uses anon client + INSERT RLS policy)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { error: dbErr } = await supabase
      .from("contact_messages")
      .insert({ name, email, message });
    if (dbErr) console.error("DB insert error:", dbErr);

    // 2. Send email via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const TO_EMAIL = Deno.env.get("CONTACT_NOTIFICATION_EMAIL");

    if (RESEND_API_KEY && TO_EMAIL) {
      const escape = (s: string) =>
        s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

      const html = `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
          <h2 style="margin:0 0 16px">New portfolio message</h2>
          <p style="margin:4px 0"><strong>From:</strong> ${escape(name)} &lt;${escape(email)}&gt;</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="white-space:pre-wrap;line-height:1.5">${escape(message)}</p>
        </div>`;

      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [TO_EMAIL],
          reply_to: email,
          subject: `New message from ${name}`,
          html,
        }),
      });
      if (!r.ok) {
        const txt = await r.text();
        console.error("Resend error:", r.status, txt);
      }
    } else {
      console.warn("Resend not configured — message saved to DB only");
    }

    return json({ success: true });
  } catch (e) {
    console.error("send-contact-email error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
