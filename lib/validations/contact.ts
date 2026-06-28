import { z } from "zod";

export const interestOptionSchema = z.enum([
  "sepela-cinema",
  "sepela-erp",
  "sepela-events",
  "custom-app-development",
  "business-automation",
  "cloud-scaling",
  "general-consultation",
]);

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters."),
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters."),
  businessEmail: z
    .string()
    .trim()
    .email("A valid business email is required."),
  interest: interestOptionSchema,
  projectBrief: z
    .string()
    .trim()
    .min(20, "Project brief must be at least 20 characters."),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
export type InterestOption = z.infer<typeof interestOptionSchema>;

export function formatZodErrors(
  error: z.ZodError<ContactFormPayload>,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
