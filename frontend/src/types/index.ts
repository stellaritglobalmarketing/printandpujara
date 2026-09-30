import type { LucideIcon } from "lucide-react";

export type AccentColor = "violet" | "orange" | "blue" | "green" | "pink";

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface TrustBadge {
  icon: LucideIcon;
  accent: AccentColor;
  title: string;
  description: string;
}

export interface SolutionCard {
  icon: LucideIcon;
  accent: AccentColor;
  title: string;
  description: string;
  imageQuery: string;
}

export interface ProcessStep {
  icon: LucideIcon;
  accent: AccentColor;
  number: string;
  title: string;
  description: string;
}

export interface StatItem {
  icon: LucideIcon;
  accent: AccentColor;
  value: string;
  label: string;
}

export interface PortfolioItem {
  title: string;
  category: string;
  imageQuery: string;
}

export interface WhyUsItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}
