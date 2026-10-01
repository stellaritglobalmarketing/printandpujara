import type { Metadata } from "next";
import "../globals.css";
import "../home.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getServiceCategories } from "@/services/serviceService";
import { getSiteSettings, getNavigationCategories } from "@/services/siteService";
import { WhatsAppProvider, WhatsAppButton } from "@/components/common/WhatsApp";

export const metadata: Metadata = {
  title: "Pujara Print Pack | Smart Printing, Stunning Impact",
  description:
    "Professional printing and packaging solutions with premium materials, advanced technology, and expert craftsmanship. Business cards, flyers, brochures, banners, and custom printing.",
  keywords: [
    "printing",
    "packaging",
    "business cards",
    "brochures",
    "custom printing",
    "banners",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, blogCategories, settings] = await Promise.all([
    getServiceCategories().catch(() => []),
    getNavigationCategories("blog-categories").catch(() => []),
    getSiteSettings().catch(() => undefined),
  ]);
  return (
    <html lang="en" className="antialiased">
      <body className="bg-page"><WhatsAppProvider number={settings?.whatsapp || settings?.phone}><Navbar categoryLinks={{
        "/services": [{ label: "All Services", href: "/services" }, ...categories.map(category => ({ label: category.name, href: `/services#category-${encodeURIComponent(category.slug)}` }))],
        "/blogs": [{ label: "All Blogs", href: "/blogs" }, ...blogCategories.map(category => ({ label: category.name, href: `/blogs?category=${encodeURIComponent(category.slug)}` }))],
      }} phone={settings?.phone} logoUrl={settings?.logo_url} siteName={settings?.site_name} />{children}<Footer contact={settings} logoUrl={settings?.logo_url} siteName={settings?.site_name} /><WhatsAppButton /></WhatsAppProvider></body>
    </html>
  );
}
