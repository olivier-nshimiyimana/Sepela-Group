import { z } from "zod";

export const interestOptionSchema = z.enum([
  "sepela-cinema",
  "sepela-erp",
  "sepela-events",
  "sepela-e-voting",
  "custom-app-development",
  "business-automation",
  "cloud-scaling",
  "general-consultation",
]);

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "validation.fullNameMin"),
  companyName: z.string().trim().min(2, "validation.companyNameMin"),
  businessEmail: z.string().trim().email("validation.emailInvalid"),
  interest: interestOptionSchema,
  projectBrief: z.string().trim().min(20, "validation.briefMin"),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
export type InterestOption = z.infer<typeof interestOptionSchema>;

export { formatZodErrors } from "@/lib/validations/zod";
