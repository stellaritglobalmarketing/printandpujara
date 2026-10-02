"use client";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";

const SERVICES = ["Offset Printing", "Digital Printing", "Packaging & Custom Boxes", "Cartons & Labels", "Flex, Vinyl & Signage", "Customized Gifts", "3D Printing", "Other"];

// "compact" is the homepage quote card: placeholder-only fields in a tighter layout, same submission flow.
export function ContactForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const [status, setStatus] = useState<{ error: boolean; message: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    submitting.current = true; setPending(true); setStatus(null);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const result = await response.json();
      if (response.ok && result.code === 1) {
        setStatus({ error: false, message: "Thank you! Your quote request has been received. Our team will contact you soon." });
        form.reset();
      } else setStatus({ error: true, message: result.message || "Unable to submit your quote request. Please try again later." });
    } catch { setStatus({ error: true, message: "We couldn’t confirm your submission. Please contact us by phone or WhatsApp before sending again." }); }
    finally { submitting.current = false; setPending(false); }
  }
  const statusMessage = status && <p className={status.error ? "contact-error" : "contact-success"} role={status.error ? "alert" : "status"}>{status.message}</p>;

  if (variant === "compact") return <form className="quote-form" onSubmit={submit} aria-busy={pending}><h3>Request a Quote</h3>
    <fieldset disabled={pending}>
      <div className="quote-form-row">
        <input name="name" placeholder="Your Name *" aria-label="Your name" autoComplete="name" required maxLength={150} />
        <input name="phone" type="tel" placeholder="Phone Number *" aria-label="Phone number" autoComplete="tel" required minLength={6} maxLength={20} />
      </div>
      <input name="email" type="email" placeholder="Email Address *" aria-label="Email address" autoComplete="email" required maxLength={150} />
      <select name="subject" aria-label="Service" required defaultValue="">
        <option value="" disabled>Select Service *</option>
        {SERVICES.map(service => <option key={service} value={service}>{service}</option>)}
      </select>
      <textarea name="message" placeholder="Tell us about your project… *" aria-label="Project details" rows={4} required maxLength={2000} />
      <button type="submit" className="bg-brand-gradient">{pending ? "Sending…" : <>Send Enquiry <Send size={15} aria-hidden="true" /></>}</button>
    </fieldset>
    {statusMessage}
  </form>;

  return <form className="contact-form" onSubmit={submit} aria-busy={pending}><h2>REQUEST A QUOTE</h2>
    <fieldset disabled={pending}><div className="contact-fields">
      <label>Your name *<input name="name" autoComplete="name" required maxLength={150} /></label>
      <label>Your email *<input name="email" type="email" autoComplete="email" required maxLength={150} /></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" minLength={6} maxLength={20} /></label>
      <label>Company<input name="company" autoComplete="organization" maxLength={150} /></label>
      <label className="contact-wide">Service Required *<select name="subject" required defaultValue="">
        <option value="" disabled>Select a service</option>
        {SERVICES.map(service => <option key={service} value={service}>{service}</option>)}
      </select></label>
      <label className="contact-wide">Describe Your Requirements *<textarea name="message" rows={6} required maxLength={2000} /></label>
    </div><button type="submit" className="bg-brand-gradient">{pending ? "Submitting quote request…" : "SUBMIT QUOTE REQUEST →"}</button></fieldset>
    {statusMessage}
  </form>;
}
