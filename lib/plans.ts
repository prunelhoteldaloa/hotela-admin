import type { SubscriptionPlan } from "@/services/admin.service";

export interface PlanMeta {
  label: string;
  /** Tailwind classes for an outline badge */
  badgeClassName: string;
  /** Hex color used for charts */
  color: string;
}

/**
 * Métadonnées d'affichage pour tous les plans exposés par l'API.
 * - Anciens plans (rétrocompatibilité) : ESSENTIEL, MULTI, PREMIUM
 * - Nouvelle grille (4 packs) : LIGHT, STARTER, BUSINESS, CORPORATE
 */
export const PLAN_META: Record<SubscriptionPlan, PlanMeta> = {
  ESSENTIEL: {
    label: "Essentiel",
    badgeClassName: "border-blue-300 bg-blue-50 text-blue-700",
    color: "#3b82f6",
  },
  MULTI: {
    label: "Multi",
    badgeClassName: "border-violet-300 bg-violet-50 text-violet-700",
    color: "#8b5cf6",
  },
  PREMIUM: {
    label: "Premium",
    badgeClassName: "border-amber-300 bg-amber-50 text-amber-700",
    color: "#f59e0b",
  },
  LIGHT: {
    label: "Light",
    badgeClassName: "border-sky-300 bg-sky-50 text-sky-700",
    color: "#0ea5e9",
  },
  STARTER: {
    label: "Starter",
    badgeClassName: "border-teal-300 bg-teal-50 text-teal-700",
    color: "#14b8a6",
  },
  BUSINESS: {
    label: "Business",
    badgeClassName: "border-indigo-300 bg-indigo-50 text-indigo-700",
    color: "#6366f1",
  },
  CORPORATE: {
    label: "Corporate",
    badgeClassName: "border-rose-300 bg-rose-50 text-rose-700",
    color: "#e11d48",
  },
};

export const ALL_PLANS = Object.keys(PLAN_META) as SubscriptionPlan[];

export function planLabel(plan?: string | null): string {
  if (!plan) return "—";
  return PLAN_META[plan as SubscriptionPlan]?.label ?? plan;
}

export function planBadgeClassName(plan?: string | null): string {
  if (!plan) return "border-slate-300 bg-slate-50 text-slate-700";
  return (
    PLAN_META[plan as SubscriptionPlan]?.badgeClassName ??
    "border-slate-300 bg-slate-50 text-slate-700"
  );
}

export function planColor(plan?: string | null): string {
  if (!plan) return "#94a3b8";
  return PLAN_META[plan as SubscriptionPlan]?.color ?? "#94a3b8";
}
