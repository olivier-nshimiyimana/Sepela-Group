import { Contact } from "@/components/sections/contact";
import { getPublicSiteSettings } from "@/lib/cache/public-data";

export async function ContactSection(): Promise<React.ReactElement> {
  const settings = await getPublicSiteSettings();

  return <Contact settings={settings} />;
}
