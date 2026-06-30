"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

const HERO_BACKGROUND_SRC = "/softbackground.jpg";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero(): React.ReactElement {
  const t = useTranslations("hero");
  const prefersReducedMotion = useReducedMotion();

  const metrics = [
    { label: t("metrics.uptime"), value: "99.97%" },
    { label: t("metrics.regions"), value: "12+" },
    { label: t("metrics.transactions"), value: "2.4M+" },
    { label: t("metrics.clients"), value: "150+" },
  ] as const;

  const actions = [
    { label: t("exploreProducts"), href: "#products", variant: "primary" as const },
    { label: t("contactSales"), href: "#contact", variant: "secondary" as const },
  ] as const;

  const motionProps = prefersReducedMotion
    ? { initial: false as const, animate: "visible" as const }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="hero-section relative flex min-h-[calc(100svh-5rem)] max-h-[780px] flex-col justify-center overflow-hidden pb-6 sm:max-h-[820px] sm:pb-8"
    >
      <div aria-hidden="true" className="hero-background">
        <div
          className="hero-background-image"
          style={{ backgroundImage: `url("${HERO_BACKGROUND_SRC}")` }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="hero-ambient-accent absolute -right-24 top-1/4 h-56 w-56 rounded-full blur-3xl" />
        <div className="hero-ambient-primary absolute bottom-1/4 left-1/4 h-40 w-40 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10 py-2">
        <motion.div
          className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
          variants={containerVariants}
          {...motionProps}
        >
          <div className="flex max-w-xl flex-col gap-4 lg:max-w-2xl lg:gap-5">
            <motion.div variants={itemVariants} className="flex flex-col gap-2.5 sm:gap-3">
              <h1 id="hero-heading" className="hero-title">
                {t("title")}
              </h1>

              <p className="hero-lead">{t("lead")}</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2.5 sm:gap-3"
            >
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    action.variant === "primary"
                      ? "hero-btn-primary"
                      : "hero-btn-secondary"
                  }
                >
                  {action.label}
                </Link>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="grid w-full grid-cols-2 gap-2 sm:gap-2.5 lg:w-64 lg:shrink-0 xl:w-72"
          >
            {metrics.map((metric) => (
              <div key={metric.label} className="hero-metric-card group">
                <p className="hero-metric-label">{metric.label}</p>
                <p className="hero-metric-value mt-1 sm:mt-0.5">
                  {metric.value}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <svg
        aria-hidden="true"
        className="hero-wave z-10"
        viewBox="0 0 1440 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 24C240 48 480 0 720 24C960 48 1200 0 1440 24V48H0V24Z"
          fill="white"
        />
      </svg>
    </section>
  );
}
