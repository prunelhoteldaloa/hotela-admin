import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  subscriptionsService,
  type Subscription,
  type PlanConfig,
  type BillingCycle,
  type SubscriptionPlan,
  type PaymentMethodType,
  type CreateSubscriptionDto,
  type UpdateSubscriptionDto,
} from "../services/subscriptions.service";

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

/** Opérateurs qui supportent le flux direct (payerPhone requis) */
export const DIRECT_SUPPORTED: PaymentMethodType[] = [
  "orange",
  "wave",
  "mtn",
  "moov",
  "djamo",
];

// Export conservé pour compatibilité avec les imports existants
export const PHONE_REQUIRED: PaymentMethodType[] = [];
export const OTP_REQUIRED: PaymentMethodType[] = [];

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type CheckoutStep = 1 | 2 | 3;

/**
 * Sous-états du step 3 :
 * idle         → en attente de redirection
 * redirecting  → ouverture de la page Jeko dans un nouvel onglet
 * polling      → attente de confirmation (webhook ou polling manuel)
 * success      → paiement confirmé
 * error        → paiement échoué
 */
export type PaymentSubState =
  | "idle"
  | "redirecting"
  | "polling"
  | "success"
  | "error";

export interface CheckoutState {
  isOpen: boolean;
  step: CheckoutStep;
  selectedPlan: SubscriptionPlan | null;
  selectedPayment: PaymentMethodType | null;
  forceProviderDirect: boolean;
  payerPhone: string;
  jekoPaymentRequestId: string | null;
  reference: string | null;
  paymentSubState: PaymentSubState;
  isRenewal: boolean;
}

interface SubscriptionStore {
  // ─── Données ──────────────────────────────
  subscription: Subscription | null;
  plans: PlanConfig[];
  billingCycle: BillingCycle;

  // ─── États de chargement ──────────────────
  isLoadingSubscription: boolean;
  isLoadingPlans: boolean;
  isProcessingPayment: boolean;
  isCancelling: boolean;
  isReactivating: boolean;

  // ─── Erreurs ──────────────────────────────
  error: string | null;

  // ─── Checkout modal ───────────────────────
  checkout: CheckoutState;

  // ─── Actions : données ────────────────────
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchAll: () => Promise<void>;
  setBillingCycle: (cycle: BillingCycle) => void;

  // ─── Actions : abonnement ─────────────────
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;

  // ─── Actions : checkout ───────────────────
  openCheckout: (planId?: SubscriptionPlan) => void;
  closeCheckout: () => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedPlan: (plan: SubscriptionPlan | null) => void;
  setSelectedPayment: (method: PaymentMethodType | null) => void;
  setForceProviderDirect: (v: boolean) => void;
  setPayerPhone: (v: string) => void;

  // ─── Actions : paiement ───────────────────
  initiatePayment: () => Promise<void>;
  checkPaymentStatus: () => Promise<void>;

  // ─── Utilitaires ──────────────────────────
  clearError: () => void;
  getTrialDaysLeft: () => number;
  isFeatureAvailable: (featureKey: string) => boolean;
  getSelectedPlanConfig: () => PlanConfig | null;
  getSelectedPlanPrice: () => number;

  // ─── Compat hooks ─────────────────────────
  // Ces actions sont no-op dans le flux Jeko (conservées pour éviter les
  // erreurs dans les composants qui les appellent encore)
  setPhoneNumber: (v: string) => void;
  setPrefixPhone: (v: string) => void;
  setOtpCode: (v: string) => void;
  submitOtp: () => Promise<void>;

  // ─── Interne ──────────────────────────────
  _startPolling: (jekoPaymentRequestId: string) => Promise<void>;
}

// ─────────────────────────────────────────────
// État initial
// ─────────────────────────────────────────────

const initialCheckout: CheckoutState = {
  isOpen: false,
  step: 1,
  selectedPlan: null,
  selectedPayment: null,
  forceProviderDirect: false,
  payerPhone: "",
  jekoPaymentRequestId: null,
  reference: null,
  paymentSubState: "idle",
  isRenewal: false,
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function buildReturnUrl(type: "success" | "error") {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/subscriptions?payment=${type}`;
}

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

export const useSubscriptionStore = create<SubscriptionStore>()(
  devtools(
    (set, get) => ({
      // ─── État initial ─────────────────────
      subscription: null,
      plans: [],
      billingCycle: "monthly",
      isLoadingSubscription: false,
      isLoadingPlans: false,
      isProcessingPayment: false,
      isCancelling: false,
      isReactivating: false,
      error: null,
      checkout: initialCheckout,

      // ─── Chargement ───────────────────────

      fetchSubscription: async () => {
        set({ isLoadingSubscription: true, error: null });
        try {
          const subscription = await subscriptionsService.getMySubscription();
          set({ subscription });
        } catch (err: any) {
          set({
            error: err?.message ?? "Erreur lors du chargement de l'abonnement",
          });
        } finally {
          set({ isLoadingSubscription: false });
        }
      },

      fetchPlans: async () => {
        set({ isLoadingPlans: true, error: null });
        try {
          const plans = await subscriptionsService.getPlans();
          set({ plans });
        } catch (err: any) {
          set({
            error: err?.message ?? "Erreur lors du chargement des plans",
          });
        } finally {
          set({ isLoadingPlans: false });
        }
      },

      fetchAll: async () => {
        const { fetchSubscription, fetchPlans } = get();
        await Promise.all([fetchSubscription(), fetchPlans()]);
      },

      setBillingCycle: (cycle) => set({ billingCycle: cycle }),

      // ─── Abonnement ───────────────────────

      cancelSubscription: async () => {
        set({ isCancelling: true, error: null });
        try {
          const subscription = await subscriptionsService.cancelSubscription();
          set({ subscription });
        } catch (err: any) {
          set({ error: err?.message ?? "Erreur lors de l'annulation" });
        } finally {
          set({ isCancelling: false });
        }
      },

      reactivateSubscription: async () => {
        set({ isReactivating: true, error: null });
        try {
          const subscription =
            await subscriptionsService.reactivateSubscription();
          set({ subscription });
        } catch (err: any) {
          set({ error: err?.message ?? "Erreur lors de la réactivation" });
        } finally {
          set({ isReactivating: false });
        }
      },

      // ─── Checkout : navigation ────────────

      openCheckout: (planId) => {
        const currentPlan = get().subscription?.plan;
        const isRenewal = !!planId && planId === currentPlan;
        set({
          checkout: {
            ...initialCheckout,
            isOpen: true,
            selectedPlan: planId ?? null,
            isRenewal,
          },
        });
      },

      closeCheckout: () =>
        set({ checkout: { ...initialCheckout, isOpen: false } }),

      setCheckoutStep: (step) =>
        set((s) => ({ checkout: { ...s.checkout, step } })),

      nextStep: () =>
        set((s) => ({
          checkout: {
            ...s.checkout,
            step: Math.min(s.checkout.step + 1, 3) as CheckoutStep,
          },
        })),

      prevStep: () =>
        set((s) => ({
          checkout: {
            ...s.checkout,
            step: Math.max(s.checkout.step - 1, 1) as CheckoutStep,
            paymentSubState:
              s.checkout.step === 3 ? "idle" : s.checkout.paymentSubState,
            jekoPaymentRequestId:
              s.checkout.step === 3 ? null : s.checkout.jekoPaymentRequestId,
            reference: s.checkout.step === 3 ? null : s.checkout.reference,
          },
        })),

      setSelectedPlan: (plan) =>
        set((s) => ({ checkout: { ...s.checkout, selectedPlan: plan } })),

      setSelectedPayment: (method) =>
        set((s) => ({
          checkout: { ...s.checkout, selectedPayment: method },
        })),

      setForceProviderDirect: (v) =>
        set((s) => ({
          checkout: { ...s.checkout, forceProviderDirect: v },
        })),

      setPayerPhone: (v) =>
        set((s) => ({ checkout: { ...s.checkout, payerPhone: v } })),

      // ─── No-ops (compat CinetPay) ─────────

      setPhoneNumber: () => {},
      setPrefixPhone: () => {},
      setOtpCode: () => {},
      submitOtp: async () => {},

      // ─── Paiement ─────────────────────────

      initiatePayment: async () => {
        const { checkout, billingCycle } = get();
        const {
          selectedPlan,
          selectedPayment,
          forceProviderDirect,
          payerPhone,
        } = checkout;

        if (!selectedPlan || !selectedPayment) return;

        set({ isProcessingPayment: true, error: null });
        set((s) => ({
          checkout: { ...s.checkout, paymentSubState: "redirecting" },
        }));

        try {
          const res = await subscriptionsService.initiatePayment({
            plan: selectedPlan,
            amountXof: get().getSelectedPlanPrice(),
            billingCycle,
            paymentMethod: selectedPayment,
            successUrl: buildReturnUrl("success"),
            errorUrl: buildReturnUrl("error"),
            ...(forceProviderDirect && {
              forceProviderDirect: true,
              payerPhone,
            }),
          });

          // Stocker les IDs pour le polling ultérieur
          set((s) => ({
            checkout: {
              ...s.checkout,
              jekoPaymentRequestId: res.jekoPaymentRequestId,
              reference: res.reference,
              paymentSubState: "polling",
            },
          }));

          // Ouvrir la page de paiement Jeko dans un nouvel onglet
          window.open(res.redirectUrl, "_blank", "noopener,noreferrer");

          // Démarrer le polling en arrière-plan
          get()._startPolling(res.jekoPaymentRequestId);
        } catch (err: any) {
          set((s) => ({
            error: err?.message ?? "Erreur lors de l'initiation du paiement",
            checkout: { ...s.checkout, paymentSubState: "error" },
          }));
        } finally {
          set({ isProcessingPayment: false });
        }
      },

      checkPaymentStatus: async () => {
        const { checkout } = get();
        if (!checkout.jekoPaymentRequestId) return;

        set({ isProcessingPayment: true, error: null });
        try {
          const res = await subscriptionsService.confirmPayment(
            checkout.jekoPaymentRequestId,
          );
          if (res.status === "success") {
            await get().fetchSubscription();
            set((s) => ({
              checkout: { ...s.checkout, paymentSubState: "success" },
            }));
          } else if (res.status === "error") {
            set((s) => ({
              error: res.errorReason ?? "Paiement refusé par l'opérateur.",
              checkout: { ...s.checkout, paymentSubState: "error" },
            }));
          }
          // pending → l'utilisateur réessaie plus tard
        } catch (err: any) {
          set({ error: err?.message ?? "Erreur lors de la vérification" });
        } finally {
          set({ isProcessingPayment: false });
        }
      },

      // ─── Polling interne ──────────────────

      // subscription.store.ts — _startPolling
      // En prod, le webhook a déjà activé avant que le polling finisse
      // On fait juste 3 tentatives pour confirmer visuellement côté UI
      _startPolling: async (jekoPaymentRequestId) => {
        try {
          const res = await subscriptionsService.pollPayment(
            jekoPaymentRequestId,
            3, // 3 tentatives max
            5000, // toutes les 5s
          );
          if (res.status === "success") {
            await get().fetchSubscription();
            set((s) => ({
              checkout: { ...s.checkout, paymentSubState: "success" },
            }));
          } else if (res.status === "error") {
            set((s) => ({
              error: res.errorReason ?? "Paiement refusé.",
              checkout: { ...s.checkout, paymentSubState: "error" },
            }));
          }
          // Si toujours pending après 3 tentatives → l'utilisateur clique "Vérifier"
        } catch {
          set((s) => ({
            checkout: { ...s.checkout, paymentSubState: "polling" },
          }));
        }
      },
      // ─── Utilitaires ──────────────────────

      clearError: () => set({ error: null }),

      getTrialDaysLeft: () => {
        const { subscription } = get();
        if (!subscription?.trialEndsAt) return 0;
        const diff = new Date(subscription.trialEndsAt).getTime() - Date.now();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      },

      isFeatureAvailable: (featureKey) => {
        const { subscription, plans } = get();
        if (!subscription) return false;
        if (subscription.status === "TRIAL") return true;
        if (subscription.status !== "ACTIVE") return false;
        const planConfig = plans.find((p) => p.id === subscription.plan);
        if (!planConfig) return false;
        const feature = planConfig.features.find((f) => f.key === featureKey);
        return !!feature && feature.value !== false;
      },

      getSelectedPlanConfig: () => {
        const { plans, checkout } = get();
        if (!checkout.selectedPlan) return null;
        return plans.find((p) => p.id === checkout.selectedPlan) ?? null;
      },

      getSelectedPlanPrice: () => {
        const { billingCycle } = get();
        const planConfig = get().getSelectedPlanConfig();
        if (!planConfig) return 0;
        return billingCycle === "yearly"
          ? planConfig.annualPrice
          : planConfig.monthlyPrice;
      },
    }),
    { name: "subscription-store" },
  ),
);

// ─────────────────────────────────────────────
// Sélecteurs atomiques
// ─────────────────────────────────────────────

export const useCurrentPlan = () =>
  useSubscriptionStore((s) => s.subscription?.plan ?? null);

export const useIsSubscriptionActive = () =>
  useSubscriptionStore((s) =>
    s.subscription
      ? ["ACTIVE", "TRIAL"].includes(s.subscription.status)
      : false,
  );

export const useTrialDaysLeft = () =>
  useSubscriptionStore((s) => s.getTrialDaysLeft());

export const useCheckout = () => useSubscriptionStore((s) => s.checkout);

export const useSelectedPlanPrice = () =>
  useSubscriptionStore((s) => s.getSelectedPlanPrice());
