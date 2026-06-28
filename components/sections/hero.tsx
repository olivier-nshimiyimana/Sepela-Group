"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

interface HeroMetric {
  label: string;
  value: string;
}

interface HeroAction {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

const HERO_METRICS: readonly HeroMetric[] = [
  { label: "System Uptime", value: "99.97%" },
  { label: "Regional Operations", value: "12+" },
  { label: "Transactions", value: "2.4M+" },
  { label: "Enterprise Clients", value: "150+" },
] as const;

const HERO_ACTIONS: readonly HeroAction[] = [
  { label: "Explore Products", href: "#products", variant: "primary" },
  { label: "Contact Sales", href: "#contact", variant: "secondary" },
] as const;

const HERO_BACKGROUND_SRC = "/softbackground.jpg?v=3";

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
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex h-[calc(100dvh-4rem)] max-h-[780px] flex-col justify-center overflow-hidden pb-10 sm:max-h-[820px] sm:pb-12"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src={HERO_BACKGROUND_SRC}
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-[78%_center] lg:object-[right_center]"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="hero-ambient-accent absolute -right-24 top-1/4 h-56 w-56 rounded-full blur-3xl" />
        <div className="hero-ambient-primary absolute bottom-1/4 left-1/4 h-40 w-40 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10 py-2">
        <motion.div
          className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex max-w-xl flex-col gap-4 lg:max-w-2xl lg:gap-5">
            <motion.div variants={itemVariants} className="flex flex-col gap-2.5 sm:gap-3">
              <h1 id="hero-heading" className="hero-title">
                Experience the Future of Enterprise Technology
              </h1>

              <p className="hero-lead">
                Comprehensive digital solutions tailored to your business —
                production-grade platforms engineered with cutting-edge
                technology and enterprise reliability.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2.5 sm:gap-3"
            >
              {HERO_ACTIONS.map((action) => (
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
            {HERO_METRICS.map((metric) => (
              <div key={metric.label} className="hero-metric-card group">
                <p className="hero-metric-label">{metric.label}</p>
                <p className="hero-metric-value mt-0.5 text-base sm:text-lg lg:text-xl">
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
