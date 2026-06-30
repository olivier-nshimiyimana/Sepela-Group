import { z } from "zod";

export const productIconSchema = z.enum([
  "clapperboard",
  "shopping-cart",
  "ticket",
  "vote",
  "app-window",
  "cloud",
  "workflow",
]);

export const productSchema = z.object({
  name: z.string().min(2, "validation.productNameMin").max(120),
  tagline: z.string().min(2, "validation.productTaglineMin").max(160),
  description: z.string().min(20, "validation.productDescriptionMin").max(500),
  content: z.string().min(20, "validation.productContentMin"),
  coverImage: z.string().min(1, "validation.productCoverRequired"),
  images: z.array(z.string()).optional().default([]),
  features: z
    .array(z.string().min(2, "validation.productFeatureMin"))
    .min(1, "validation.productFeaturesRequired")
    .max(8, "validation.productFeaturesMax"),
  icon: productIconSchema,
  published: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const productUpdateSchema = productSchema.partial();

const optionalUrlSchema = z.union([
  z.literal(""),
  z.string().url("validation.urlInvalidOrBlank"),
]);

export const siteSettingsSchema = z.object({
  email: z.string().email("validation.settingsEmailInvalid"),
  phone: z.string().min(5, "validation.settingsPhoneMin").max(40),
  addressLine: z.string().min(2, "validation.settingsAddressMin").max(200),
  city: z.string().min(2, "validation.settingsCityMin").max(100),
  country: z.string().min(2, "validation.settingsCountryMin").max(100),
  footerTagline: z.string().min(10, "validation.settingsTaglineMin").max(300),
  facebookUrl: optionalUrlSchema,
  instagramUrl: optionalUrlSchema,
  xUrl: optionalUrlSchema,
  tiktokUrl: optionalUrlSchema,
  youtubeUrl: optionalUrlSchema,
});
