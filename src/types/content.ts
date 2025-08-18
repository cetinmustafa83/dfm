export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceContent {
  id: string;
  title: string;
  description: string;
  image?: string;
  featured: boolean;
}

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
  active: boolean;
  postedAt: Date;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  contactEmail: string;
  socialMedia: {
    linkedIn?: string;
    twitter?: string;
    facebook?: string;
  };
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
  };
}