import { z } from "zod";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "validation.passwordRequired"),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
