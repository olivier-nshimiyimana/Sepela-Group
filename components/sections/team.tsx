import {
  Bot,
  CloudCog,
  Layers,
  type LucideIcon,
} from "lucide-react";

interface TeamRole {
  id: string;
  title: string;
  discipline: string;
  description: string;
  expertise: readonly string[];
  icon: LucideIcon;
}

const TEAM_ROLES: readonly TeamRole[] = [
  {
    id: "fullstack",
    title: "Full-Stack Architecture",
    discipline: "Application Engineering",
    description:
      "End-to-end system design spanning React, Next.js, mobile runtimes, and resilient API layers built for long-term maintainability.",
    expertise: [
      "Next.js & React ecosystems",
      "REST & GraphQL API design",
      "Type-safe full-stack patterns",
    ],
    icon: Layers,
  },
  {
    id: "devops",
    title: "Cloud & Infrastructure DevOps",
    discipline: "Platform Engineering",
    description:
      "Production-grade cloud deployments with container orchestration, CI/CD pipelines, and observability across multi-region environments.",
    expertise: [
      "Kubernetes & containerization",
      "CI/CD pipeline automation",
      "Monitoring & incident response",
    ],
    icon: CloudCog,
  },
  {
    id: "automation",
    title: "Automation Engineering",
    discipline: "Process Intelligence",
    description:
      "Custom automation frameworks that connect legacy systems, orchestrate workflows, and eliminate operational friction at scale.",
    expertise: [
      "Workflow orchestration",
      "Industrial system integration",
      "Scripted process pipelines",
    ],
    icon: Bot,
  },
] as const;

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
        <p
          className="text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {role.discipline}
        </p>
        <h3
          className="mt-2 text-xl font-bold text-text-primary transition-colors duration-300 sm:text-2xl"
          style={{ transition: "color 0.3s" }}
        >
          {role.title}
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-text-secondary">
        {role.description}
      </p>

      <ul className="flex flex-col gap-2" role="list">
        {role.expertise.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-sm text-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-text-primary"
          >
            <span aria-hidden="true" className="ai-feature-dot" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Team(): React.ReactElement {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="ai-section-bg py-20 sm:py-28"
    >
      <div className="section-container">
        <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="section-eyebrow">Engineering Team</span>
          <h2 id="team-heading" className="section-heading mt-2">
            Engineering excellence
          </h2>
          <p className="section-description mt-4">
            A multidisciplinary team delivering production systems with the
            rigor, reliability, and precision enterprise clients demand.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {TEAM_ROLES.map((role) => (
            <TeamCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}
