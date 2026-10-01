import {
  Award,
  Boxes,
  Clock,
  Heart,
  Gauge,
  Share2,
  Layers,
  TrendingUp,
  Mail,
  MapPin,
  Phone,
  Printer,
  Gift,
  Rocket,
  FileText,
  Send,
  CheckCircle,
  ShoppingCart,
  Star,
  Truck,
  Upload,
  Users,
  Eye,
  Zap,
  Package,
} from "lucide-react";
import type {
  FooterLinkGroup,
  NavLink,
  PortfolioItem,
  ProcessStep,
  SolutionCard,
  StatItem,
  WhyUsItem,
} from "@/types";

export const siteConfig = {
  name: "Pujara Print Pack",
  tagline: "Proficient with perfect printing",
  phone: "+919819894284",
  secondaryPhone: "+91 98670 44343",
  phoneDisplay: "+91 98198 94284",
  email: "pujarapnp@gmail.com",
  address: "Unit No. A/07, Girikunj Industrial Estate, Off Mahakali Caves Rd, Andheri East, Mumbai, Maharashtra 400093.",
  hoursWeekday: "Mon - Fri: 8:00 AM - 6:00 PM",
  hoursSaturday: "Sat: 9:00 AM - 2:00 PM",
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "Our Clients", href: "/testimonials" },
  { label: "About Us", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact-us" },
];

export const solutionCards: SolutionCard[] = [
  {
    icon: FileText,
    accent: "violet",
    title: "Business Cards",
    description: "Make a lasting first impression.",
    imageQuery: "colorful business card mockup stack",
  },
  {
    icon: Layers,
    accent: "orange",
    title: "Flyers & Brochures",
    description: "Promote your business the smart way.",
    imageQuery: "tri-fold brochure print design",
  },
  {
    icon: Zap,
    accent: "pink",
    title: "Banners & Signage",
    description: "High-impact displays that get noticed.",
    imageQuery: "outdoor banner stand advertising",
  },
  {
    icon: Package,
    accent: "blue",
    title: "Booklets & Catalogs",
    description: "Showcase your brand beautifully.",
    imageQuery: "open catalog magazine spread",
  },
  {
    icon: Boxes,
    accent: "green",
    title: "Packaging & Labels",
    description: "Custom packaging that stands out.",
    imageQuery: "custom cardboard packaging boxes",
  },
  {
    icon: Gift,
    accent: "violet",
    title: "Custom Printing",
    description: "Apparel, promos & much more.",
    imageQuery: "custom printed t-shirt apparel",
  },
];

export const processSteps: ProcessStep[] = [
  {
    icon: ShoppingCart,
    accent: "violet",
    number: "01",
    title: "Choose Product",
    description: "Select the product and specifications you need.",
  },
  {
    icon: Upload,
    accent: "orange",
    number: "02",
    title: "Upload Design",
    description: "Upload your file or we can help you design.",
  },
  {
    icon: FileText,
    accent: "pink",
    number: "03",
    title: "Review & Confirm",
    description: "We review your order and confirm details.",
  },
  {
    icon: Printer,
    accent: "blue",
    number: "04",
    title: "We Print",
    description: "Advanced technology prints with precision.",
  },
  {
    icon: Truck,
    accent: "green",
    number: "05",
    title: "Delivered To You",
    description: "Fast, safe delivery to your doorstep.",
  },
];

export const statItems: StatItem[] = [
  {
    icon: Award,
    accent: "violet",
    value: "19+",
    label: "Years of Experience",
  },
  {
    icon: Printer,
    accent: "pink",
    value: "59+",
    label: "Print & Packaging Solutions",
  },
  {
    icon: Gauge,
    accent: "green",
    value: "13+",
    label: "Service Categories",
  },
  {
    icon: Users,
    accent: "orange",
    value: "32+",
    label: "Corporate Clients",
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Business Card Design",
    category: "Branding",
    imageQuery: "stacked business cards dark background",
  },
  {
    title: "Brochure Design",
    category: "Print",
    imageQuery: "open brochure geometric pattern",
  },
  {
    title: "Banner Design",
    category: "Signage",
    imageQuery: "large outdoor billboard advertisement",
  },
  {
    title: "Packaging Design",
    category: "Packaging",
    imageQuery: "branded shipping boxes stacked",
  },
  {
    title: "Catalog Design",
    category: "Print",
    imageQuery: "open catalog book pages",
  },
  {
    title: "Apparel Printing",
    category: "Custom",
    imageQuery: "black t-shirt colorful print design",
  },
];

export const whyUsItems: WhyUsItem[] = [
  {
    icon: CheckCircle,
    title: "Premium Quality",
    description: "Every job is checked against strict colour and finish standards before it leaves our facility.",
  },
  {
    icon: TrendingUp,
    title: "Competitive Pricing",
    description: "Transparent, volume-based quotes that work for freelancers and large corporates alike.",
  },
  {
    icon: Rocket,
    title: "One-Stop Print Shop",
    description: "Offset & digital printing, packaging, gifting and signage — 50+ solutions under one roof since 2007.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "One point of contact from enquiry to doorstep delivery, ready to solve problems fast.",
  },
];

// Short, verifiable capability bullets per service category (services page hero blocks).
// Deliberately generic — no invented machine brands/models or unverified technical specs.
export const categoryHighlights: Record<string, string[]> = {
  "offset-print": ["Sharp, consistent colour reproduction", "From short runs to bulk print jobs", "Premium stock & finishing options", "Ideal for brochures, catalogues & stationery"],
  "digital-print": ["Fast turnaround for short runs & reprints", "Vivid, consistent colour output", "No offset setup time", "Great for time-sensitive marketing"],
  "gifting-ideas": ["Custom branding on every item", "Popular for corporate giveaways", "Mugs, diaries, pens & more", "Keeps your brand visible long-term"],
  "outdoor-work": ["Weather-resistant materials", "Vivid colour, legible from a distance", "Built for storefronts & installations", "Flex, vinyl & backlit options"],
  "identification": ["Secure, durable card printing", "Consistent standard across your team", "Ideal for offices, schools & events", "Barcode & RF-enabled options"],
  "finishing": ["Binding, lamination & die-cutting", "Clean folds & accurate cuts", "Turns sheets into a finished product", "Matched to how it will be used"],
  "packaging": ["Structural design to print finishing", "Protects & presents your product", "Shelf-ready presentation", "Custom sizes & materials"],
  "document-scanning": ["Scanning up to 600 dpi", "Both sides captured in one pass", "Secure, compliant digital archives", "Delivered via CD, FTP or web"],
  "xerox-printers-rental": ["Flexible lease terms", "Serviced & ready from day one", "For schools, colleges & offices", "Backed by our support team"],
  "customized-diaries": ["Premium materials & covers", "Wide range of designs", "Popular year-round corporate gift", "Fully brandable"],
  "customized-gifts": ["Sourced & branded to your budget", "Wide range of corporate gift items", "Perfect for occasions & milestones", "We help you pick the right product"],
  "t-shirts-caps": ["Durable, consistent print quality", "Great for teams & events", "Bulk order friendly", "Multiple sizes & colours"],
  "customized-trophy-plaques": ["Crafted to honour achievements", "Corporate, sports & academic use", "Professional finishing standard", "Personalised engraving/printing"],
};

// Short showcase copy for categories whose admin description is too long for the hero block.
export const categorySummaries: Record<string, string> = {
  "document-scanning": "We convert large or small volumes of paper records into searchable digital files. Our scanners capture colour, greyscale or b/w at up to 600 dpi, scan both sides in one pass, and deliver via CD, FTP or the web — securely and at reasonable rates.",
  "customized-diaries": "Premium-quality diaries in a wide range of designs for professional and personal use. We also create fully customised, branded diaries for corporates — built with meticulous attention to detail.",
};

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blog", href: "/blogs" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "Our Services",
    links: [
      { label: "Business Cards", href: "/services/business-cards" },
      { label: "Flyers & Brochures", href: "/services/flyers-brochures" },
      { label: "Banners & Signage", href: "/services/banners-signage" },
      { label: "Booklets & Catalogs", href: "/services/booklets-catalogs" },
      { label: "Packaging & Labels", href: "/services/packaging-labels" },
      { label: "Custom Printing", href: "/services/custom-printing" },
      { label: "And More", href: "/services" },
    ],
  },
];

export const footerContactItems = [
  { icon: MapPin, label: siteConfig.address },
  { icon: Phone, label: siteConfig.phoneDisplay },
  { icon: Mail, label: siteConfig.email },
  { icon: Clock, label: `${siteConfig.hoursWeekday}\n${siteConfig.hoursSaturday}` },
];

export const socialLinks = [
  { icon: Heart, label: "Like", href: "https://facebook.com" },
  { icon: Share2, label: "Share", href: "https://instagram.com" },
  { icon: Gift, label: "Gift", href: "https://github.com" },
  { icon: Mail, label: "Email", href: "mailto:info@pujaraprint.com" },
];
