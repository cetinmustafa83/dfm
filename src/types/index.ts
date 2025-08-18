export interface SiteSettings {
  siteTitle?: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  description: string;
  requirements: string;
  isActive: boolean;
  postedAt: string;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  alt: string;
  uploadedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}