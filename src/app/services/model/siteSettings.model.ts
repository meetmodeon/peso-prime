export interface ProjectsHeroSectionRequest {
  imageId?: number;
  title: string;
  siteSettingId:number,
  details: string;
}
export interface ProjectsHeroSectionResponse{
    id:number;
    imageId?: string;
    title: string;
    details: string;
}

export interface WorkingHours {
  days: string;      // e.g. "Monday - Friday"
  openTime: string;  // e.g. "09:00"
  closeTime: string; // e.g. "18:00"
}
export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?:string;
  tiktok?:string;
}

export interface SiteSettingsRespone {
  socialMediaLinks: any;
  // Company Info
  id:number;
  companyName: string;
  companyLogoId?:number;
  address: string;
  email: string;
  phone: string;
  workingHours: WorkingHours;

  // Projects Hero Section (home page)
  projectHeroSection: ProjectsHeroSectionResponse[];

  // Social Links
  socialLinks: SocialMediaLinks;

  // SEO
  metaTitle: string;
  metaDescription: string;
}
export interface SiteSettingsRequest {
  // Company Info
  companyName: string;
  companyLogoId?:number;
  address: string;
  email: string;
  phone: string;
  workingHours: WorkingHours;


  // Social Links
  socialMediaLinks: SocialMediaLinks;

  // SEO
  metaTitle: string;
  metaDescription: string;
}