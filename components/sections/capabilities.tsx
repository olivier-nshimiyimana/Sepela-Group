import {
  AppWindow,
  Cloud,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

interface Capability {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: readonly string[];
  icon: LucideIcon;
}

const CAPABILITY_ICONS = {
  customApps: AppWindow,
  automation: Workflow,
  cloud: Cloud,
} as const;

interface CapabilityCardProps {
  capability: Capability;
}

function CapabilityCard({
  capability,
}: CapabilityCardProps): React.ReactElement {
  const Icon = capability.icon;

  return (
    <article className="feature-card group">
      <div className="ai-icon-wrap transition-all duration-300 group-hover:border-[rgb(29,112,242,0.35)]">
        <span aria-hidden="true" className="ai-icon-glow" />
        <Icon aria-hidden="true" className="relative h-7 w-7" />
      </div>

      <p className="card-eyebrow">
        {capability.subtitle}
      </p>

      <h3 className="card-title mt-2">
        {capability.title}
      </h3>

      <p className="card-body mt-3 flex-1">
        {capability.description}
      </p>

      <ul className="mt-5 flex flex-col gap-2.5 sm:gap-2" role="list">
        {capability.highlights.map((highlight) => (
          <li key={highlight} className="card-list-item">
            <span aria-hidden="true" className="ai-feature-dot" />
            {highlight}
          </li>
        ))}
      </ul>
    </article>
  );
}

export async function Capabilities(): Promise<React.ReactElement> {
  const t = await getTranslations("capabilities");

  const capabilities: Capability[] = (
    Object.keys(CAPABILITY_ICONS) as Array<keyof typeof CAPABILITY_ICONS>
  ).map((id) => ({
    id,
    title: t(`items.${id}.title`),
    subtitle: t(`items.${id}.subtitle`),
    description: t(`items.${id}.description`),
    highlights: t.raw(`items.${id}.highlights`) as string[],
    icon: CAPABILITY_ICONS[id],
  }));

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="bg-white section-spacing"
    >
      <div className="section-container">
        <header className="section-header">
          <span className="section-eyebrow">{t("eyebrow")}</span>
          <h2 id="capabilities-heading" className="section-heading mt-2">
            {t("heading")}
          </h2>
          <p className="section-description mt-4">{t("description")}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.id} capability={capability} />
          ))}
        </div>
      </div>
    </section>
  );
}
