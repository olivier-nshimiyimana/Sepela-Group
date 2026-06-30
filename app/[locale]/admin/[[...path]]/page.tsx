import { redirect } from "next/navigation";

interface LocaleAdminRedirectProps {
  params: Promise<{ locale: string; path?: string[] }>;
}

export default async function LocaleAdminRedirect({
  params,
}: LocaleAdminRedirectProps): Promise<never> {
  const { path } = await params;
  const adminPath = path?.length ? `/${path.join("/")}` : "";
  redirect(`/admin${adminPath}`);
}
