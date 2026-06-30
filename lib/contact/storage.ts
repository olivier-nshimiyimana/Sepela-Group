import { getSql } from "@/lib/db/client";
import {
  mapContactSubmissionRow,
  type ContactSubmission,
  type ContactSubmissionRow,
} from "@/lib/db/mappers";
import { isDatabaseReady, withDatabaseRead } from "@/lib/db/resilience";
import type { ContactFormPayload } from "@/lib/validations/contact";

function logContactLocally(payload: ContactFormPayload, reason: string): void {
  console.warn(`[contact] ${reason}`, {
    name: payload.fullName,
    company: payload.companyName,
    email: payload.businessEmail,
    service: payload.interest,
  });
}

export async function createContactSubmission(
  payload: ContactFormPayload,
): Promise<void> {
  const ready = await isDatabaseReady();

  if (!ready) {
    logContactLocally(
      payload,
      "Database unavailable. Submission logged locally only.",
    );
    return;
  }

  try {
    const sql = getSql();
    await sql`
      INSERT INTO contact_submissions (
        full_name,
        company_name,
        business_email,
        interest,
        project_brief
      )
      VALUES (
        ${payload.fullName},
        ${payload.companyName},
        ${payload.businessEmail},
        ${payload.interest},
        ${payload.projectBrief}
      )
    `;
  } catch (error) {
    logContactLocally(
      payload,
      "Failed to save to database. Submission logged locally only.",
    );
    console.error("[contact] Database insert failed:", error);
  }
}

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  return withDatabaseRead(
    async () => {
      const sql = getSql();
      const rows = (await sql`
        SELECT *
        FROM contact_submissions
        ORDER BY created_at DESC
      `) as ContactSubmissionRow[];

      return rows.map(mapContactSubmissionRow);
    },
    async () => [],
  );
}
