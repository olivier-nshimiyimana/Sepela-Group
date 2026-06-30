import {
  AppWindow,
  Clapperboard,
  Cloud,
  ShoppingCart,
  Ticket,
  Vote,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import type { ProductIconKey } from "@/lib/products/types";

const PRODUCT_ICONS: Record<ProductIconKey, LucideIcon> = {
  clapperboard: Clapperboard,
  "shopping-cart": ShoppingCart,
  ticket: Ticket,
  vote: Vote,
  "app-window": AppWindow,
  cloud: Cloud,
  workflow: Workflow,
};

export function getProductIcon(icon: ProductIconKey): LucideIcon {
  return PRODUCT_ICONS[icon] ?? Clapperboard;
}

export const PRODUCT_ICON_OPTIONS: readonly ProductIconKey[] = [
  "clapperboard",
  "shopping-cart",
  "ticket",
  "vote",
  "app-window",
  "cloud",
  "workflow",
] as const;
