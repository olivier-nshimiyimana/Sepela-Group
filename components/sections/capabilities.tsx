import {
  AppWindow,
  Cloud,
  Workflow,
  type LucideIcon,
} from "lucide-react";

interface Capability {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: readonly string[];
  icon: LucideIcon;
}

const CAPABILITIES: readonly Capability[] = [
  {
    id: "custom-apps",
    title: "Custom App Development",
    subtitle: "Web, Mobile & Desktop",
    description:
      "Bespoke applications engineered for your workflows — from responsive web platforms to native mobile utilities and desktop tooling.",
    highlights: [
      "Cross-platform web & mobile",
      "Desktop utility tooling",
      "API-first architecture",
    ],
    icon: AppWindow,
  },
  {
    id: "automation",
    title: "Business & Process Automation",
    subtitle: "Industrial & Workflow Scripts",
    description:
      "Eliminate manual bottlenecks with intelligent automation pipelines, industrial integrations, and custom workflow orchestration.",
    highlights: [
      "Workflow orchestration",
      "Industrial system integration",
      "Scheduled task automation",
    ],
    icon: Workflow,
  },
  {
    id: "cloud",
    title: "Cloud Computing & Scaling",
    subtitle: "High-Availability Infrastructure",
    description:
      "Design, deploy, and manage resilient cloud infrastructure with auto-scaling, failover, and performance optimization baked in.",
    highlights: [
      "Multi-region deployment",
      "Auto-scaling & load balancing",
      "24/7 monitoring & alerting",
    ],
    icon: Cloud,
  },
] as const;

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

      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-brand-primary)" }}
      >
        {capability.subtitle}
      </p>

      <h3 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
        {capability.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
        {capability.description}
      </p>

      <ul className="mt-5 flex flex-col gap-2" role="list">
        {capability.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-center gap-2 text-sm text-text-primary"
          >
            <span aria-hidden="true" className="ai-feature-dot" />
            {highlight}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Capabilities(): React.ReactElement {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="bg-white py-20 sm:py-28"
    >
      <div className="section-container">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="section-eyebrow">Bespoke Services</span>
          <h2 id="capabilities-heading" className="section-heading mt-2">
            Bespoke Services
          </h2>
          <p className="section-description mt-4">
            Beyond our product suite, we design and deliver custom solutions
            that integrate seamlessly with your existing infrastructure.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {CAPABILITIES.map((capability) => (
            <CapabilityCard key={capability.id} capability={capability} />
          ))}
        </div>
      </div>
    </section>
  );
}
