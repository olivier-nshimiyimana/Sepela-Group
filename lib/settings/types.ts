export interface SiteSettings {
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
  footerTagline: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  updatedAt: string;
}

export interface SiteSettingsInput {
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
  footerTagline: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: "info@sepela.group",
  phone: "+250 700 000 000",
  addressLine: "Kigali",
  city: "Kigali",
  country: "Rwanda",
  footerTagline:
    "Making your digital experience better with innovative enterprise solutions.",
  facebookUrl: "",
  instagramUrl: "",
  xUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  updatedAt: new Date().toISOString(),
};
