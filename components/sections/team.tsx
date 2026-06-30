import {
  Bot,
  CloudCog,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

interface TeamRole {
  id: string;
  title: string;
  discipline: string;
  description: string;
  expertise: readonly string[];
  icon: LucideIcon;
}

const TEAM_ICONS = {
  fullstack: Layers,
  devops: CloudCog,
  automation: Bot,
} as const;

interface TeamCardProps {
  role: TeamRole;
}

function TeamCard({ role }: TeamCardProps): React.ReactElement {
  const Icon = role.icon;

  return (
    <article className="feature-card group">
      <div className="ai-icon-wrap transition-all duration-300 group-hover:border-[rgb(29,112,242,0.35)]">
        <span aria-hidden="true" className="ai-icon-glow" />
        <Icon aria-hidden="true" className="relative h-7 w-7" />
      </div>

      <div>
        <p className="card-eyebrow transition-colors duration-300">
          {role.discipline}
        </p>
        <h3 className="card-title mt-2 transition-colors duration-300">
          {role.title}
        </h3>
      </div>

      <p className="card-body">
        {role.description}
      </p>

      <ul className="flex flex-col gap-2.5 sm:gap-2" role="list">
        {role.expertise.map((item) => (
          <li
            key={item}
            className="card-list-item text-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-text-primary sm:font-normal"
          >
            <span aria-hidden="true" className="ai-feature-dot" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export async function Team(): Promise<React.ReactElement> {
  const t = await getTranslations("team");

  const roles: TeamRole[] = (
    Object.keys(TEAM_ICONS) as Array<keyof typeof TEAM_ICONS>
  ).map((id) => ({
    id,
    title: t(`items.${id}.title`),
    discipline: t(`items.${id}.discipline`),
    description: t(`items.${id}.description`),
    expertise: t.raw(`items.${id}.expertise`) as string[],
    icon: TEAM_ICONS[id],
  }));

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="ai-section-bg section-spacing"
    >
      <div className="section-container">
        <header className="section-header-wide">
          <span className="section-eyebrow">{t("eyebrow")}</span>
          <h2 id="team-heading" className="section-heading mt-2">
            {t("heading")}
          </h2>
          <p className="section-description mt-4">{t("description")}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {roles.map((role) => (
            <TeamCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}
