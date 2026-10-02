import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site-data";
import type { getSiteSettings } from "@/services/siteService";

type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;

const telHref = (phone: string) => `tel:${phone.replace(/[^+0-9]/g, "")}`;

export function HomeContact({ settings }: { settings?: SiteSettings }) {
  const phone = settings?.phone || siteConfig.phoneDisplay;
  const secondary = settings?.secondary_phone || siteConfig.secondaryPhone;
  const email = settings?.email || siteConfig.email;
  const address = settings?.address || siteConfig.address;
  return <section className="home-contact" id="contact" aria-labelledby="home-contact-heading">
    <Container className="home-contact-grid">
      <div className="home-contact-info">
        <span className="home-contact-eyebrow">Get in touch</span>
        <h2 id="home-contact-heading">Let&apos;s Start a <span className="text-brand-gradient">Conversation</span></h2>
        <p className="home-contact-lead">We&apos;re here to answer your questions and discuss your printing and packaging needs.</p>
        <ul className="home-contact-list">
          <li><span className="home-contact-icon"><MapPin size={18} aria-hidden="true" /></span><div><h3>Visit Us</h3><p>{settings?.site_name || "Pujara Print N Pack"}<br />{address}</p></div></li>
          <li><span className="home-contact-icon"><Phone size={18} aria-hidden="true" /></span><div><h3>Call Us</h3><p><a href={telHref(phone)}>{phone}</a><br /><a href={telHref(secondary)}>{secondary}</a></p></div></li>
          <li><span className="home-contact-icon"><Mail size={18} aria-hidden="true" /></span><div><h3>Email Us</h3><p><a href={`mailto:${email}`}>{email}</a></p></div></li>
        </ul>
      </div>
      <ContactForm variant="compact" />
    </Container>
  </section>;
}
