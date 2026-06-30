import type { z } from "zod";

export function formatZodErrors(
  error: z.ZodError,
  translate: (key: string) => string,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !fieldErrors[field]) {
      const messageKey = issue.message;
      fieldErrors[field] = messageKey.startsWith("validation.")
        ? translate(`errors.${messageKey}`)
        : issue.message;
    }
  }

  return fieldErrors;
}
