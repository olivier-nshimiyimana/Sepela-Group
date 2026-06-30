import { getLocale, getTranslations } from "next-intl/server";

import { getAllContactSubmissions } from "@/lib/contact/storage";
import type { InterestOption } from "@/lib/validations/contact";
import { getDatabaseStatusKey, isDatabaseReady } from "@/lib/db/resilience";
import { formatNewsDate } from "@/lib/news/utils";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage(): Promise<React.ReactElement> {
  await isDatabaseReady();
  const submissions = await getAllContactSubmissions();
  const databaseKey = getDatabaseStatusKey();
  const t = await getTranslations("admin.contacts");
  const interests = await getTranslations("contact.interests");
  const database = await getTranslations("admin.database");
  const locale = await getLocale();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-text-primary">{t("title")}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>

      {databaseKey ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {database(databaseKey)}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-text-secondary">
            <tr>
              <th className="px-3 py-3 font-semibold">{t("tableDate")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableName")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableCompany")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableEmail")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableInterest")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableBrief")}</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-gray-50 align-top">
                <td className="px-3 py-4 text-text-secondary">
                  {formatNewsDate(submission.createdAt, locale)}
                </td>
                <td className="px-3 py-4 font-medium text-text-primary">
                  {submission.fullName}
                </td>
                <td className="px-3 py-4 text-text-secondary">
                  {submission.companyName}
                </td>
                <td className="px-3 py-4 text-text-secondary">
                  {submission.businessEmail}
                </td>
                <td className="px-3 py-4 text-text-secondary">
                  {interests(submission.interest as InterestOption)}
                </td>
                <td className="max-w-xs px-3 py-4 text-text-secondary">
                  {submission.projectBrief}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {submissions.length === 0 ? (
          <p className="py-10 text-center text-text-secondary">{t("empty")}</p>
        ) : null}
      </div>
    </div>
  );
}
