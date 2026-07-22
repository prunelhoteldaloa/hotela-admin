import { useState, useCallback } from "react";
import { adminService } from "../services/admin.service";
import type {
  DashboardStats,
  AdminHotel,
  AdminSubscription,
  AdminPayment,
  AdminUser,
  AdminStay,
  ActionLog,
  SaasAdmin,
  SaasFeature,
  PlanCatalog,
  PlanDetail,
  RevenueMonth,
  RevenueByPlan,
  SubscriptionStats,
  PaginatedResponse,
  HotelQuery,
  SubscriptionQuery,
  PaymentQuery,
  UserQuery,
  LogQuery,
  PaginationQuery,
  SubscriptionPlan,
} from "../services/admin.service";

// ─── Helper générique ─────────────────────────────────────────────────────────

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (fn: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// ─── Hook principal ───────────────────────────────────────────────────────────

export function useAdmin() {
  // ── Dashboard ──────────────────────────────────────────────────────────────

  const dashboardState = useAsync<DashboardStats>();

  const fetchDashboard = useCallback(() => {
    return dashboardState.execute(() => adminService.getDashboardStats());
  }, [dashboardState.execute]);

  // ── Analytics ──────────────────────────────────────────────────────────────

  const revenueAnalyticsState = useAsync<RevenueMonth[]>();
  const revenueByPlanState = useAsync<RevenueByPlan[]>();

  const fetchRevenueAnalytics = useCallback(
    (months?: number) => {
      return revenueAnalyticsState.execute(() =>
        adminService.getRevenueAnalytics(months),
      );
    },
    [revenueAnalyticsState.execute],
  );

  const fetchRevenueByPlan = useCallback(() => {
    return revenueByPlanState.execute(() => adminService.getRevenueByPlan());
  }, [revenueByPlanState.execute]);

  // ── Hôtels ─────────────────────────────────────────────────────────────────

  const hotelsState = useAsync<PaginatedResponse<AdminHotel>>();
  const hotelDetailState = useAsync<AdminHotel>();
  const [hotelMutating, setHotelMutating] = useState(false);

  const fetchHotels = useCallback(
    (query?: HotelQuery) => {
      return hotelsState.execute(() => adminService.getAllHotels(query));
    },
    [hotelsState.execute],
  );

  const fetchHotelDetail = useCallback(
    (id: string) => {
      return hotelDetailState.execute(() => adminService.getHotelDetails(id));
    },
    [hotelDetailState.execute],
  );

  const suspendHotel = useCallback(
    async (id: string, reason: string, onSuccess?: () => void) => {
      setHotelMutating(true);
      try {
        await adminService.suspendHotel(id, reason);
        onSuccess?.();
      } finally {
        setHotelMutating(false);
      }
    },
    [],
  );

  const reactivateHotel = useCallback(
    async (id: string, onSuccess?: () => void) => {
      setHotelMutating(true);
      try {
        await adminService.reactivateHotel(id);
        onSuccess?.();
      } finally {
        setHotelMutating(false);
      }
    },
    [],
  );

  const changeHotelPlan = useCallback(
    async (id: string, plan: SubscriptionPlan, onSuccess?: () => void) => {
      setHotelMutating(true);
      try {
        await adminService.changeHotelPlan(id, plan);
        onSuccess?.();
      } finally {
        setHotelMutating(false);
      }
    },
    [],
  );

  // ── Abonnements ────────────────────────────────────────────────────────────

  const subscriptionsState = useAsync<PaginatedResponse<AdminSubscription>>();
  const subscriptionStatsState = useAsync<SubscriptionStats>();

  const fetchSubscriptions = useCallback(
    (query?: SubscriptionQuery) => {
      return subscriptionsState.execute(() =>
        adminService.getAllSubscriptions(query),
      );
    },
    [subscriptionsState.execute],
  );

  const fetchSubscriptionStats = useCallback(() => {
    return subscriptionStatsState.execute(() =>
      adminService.getSubscriptionStats(),
    );
  }, [subscriptionStatsState.execute]);

  // ── Paiements ──────────────────────────────────────────────────────────────

  const paymentsState = useAsync<PaginatedResponse<AdminPayment>>();

  const fetchPayments = useCallback(
    (query?: PaymentQuery) => {
      return paymentsState.execute(() => adminService.getAllPayments(query));
    },
    [paymentsState.execute],
  );

  // ── Utilisateurs ───────────────────────────────────────────────────────────

  const usersState = useAsync<PaginatedResponse<AdminUser>>();

  const fetchUsers = useCallback(
    (query?: UserQuery) => {
      return usersState.execute(() => adminService.getAllUsers(query));
    },
    [usersState.execute],
  );

  // ── Séjours ────────────────────────────────────────────────────────────────

  const staysState = useAsync<PaginatedResponse<AdminStay>>();

  const fetchActiveStays = useCallback(
    (query?: PaginationQuery) => {
      return staysState.execute(() => adminService.getActiveStays(query));
    },
    [staysState.execute],
  );

  // ── Journaux ───────────────────────────────────────────────────────────────

  const logsState = useAsync<PaginatedResponse<ActionLog>>();

  const fetchLogs = useCallback(
    (query?: LogQuery) => {
      return logsState.execute(() => adminService.getActionLogs(query));
    },
    [logsState.execute],
  );

  // ── Admins SaaS ────────────────────────────────────────────────────────────

  const adminsState = useAsync<SaasAdmin[]>();
  const [adminMutating, setAdminMutating] = useState(false);

  const fetchSaasAdmins = useCallback(() => {
    return adminsState.execute(() => adminService.getSaasAdmins());
  }, [adminsState.execute]);

  const promoteSaasAdmin = useCallback(
    async (userId: string, onSuccess?: () => void) => {
      setAdminMutating(true);
      try {
        await adminService.promoteSaasAdmin(userId);
        onSuccess?.();
      } finally {
        setAdminMutating(false);
      }
    },
    [],
  );

  const revokeSaasAdmin = useCallback(
    async (userId: string, onSuccess?: () => void) => {
      setAdminMutating(true);
      try {
        await adminService.revokeSaasAdmin(userId);
        onSuccess?.();
      } finally {
        setAdminMutating(false);
      }
    },
    [],
  );

  // ── Catalogue plans ────────────────────────────────────────────────────────

  const plansCatalogState = useAsync<PlanCatalog[]>();
  const planDetailState = useAsync<PlanDetail>();

  const fetchPlansCatalog = useCallback(() => {
    return plansCatalogState.execute(() => adminService.getPlansCatalog());
  }, [plansCatalogState.execute]);

  const fetchPlanDetail = useCallback(
    (plan: SubscriptionPlan) => {
      return planDetailState.execute(() => adminService.getPlanDetail(plan));
    },
    [planDetailState.execute],
  );

  // ── Catalogue features ─────────────────────────────────────────────────────

  const featuresState = useAsync<SaasFeature[]>();
  const [featureMutating, setFeatureMutating] = useState(false);

  const fetchFeatures = useCallback(() => {
    return featuresState.execute(() => adminService.getFeaturesCatalog());
  }, [featuresState.execute]);

  const createFeature = useCallback(
    async (
      data: {
        name: string;
        description: string;
        plans: SubscriptionPlan[];
        enabled?: boolean;
      },
      onSuccess?: (feature: SaasFeature) => void,
    ) => {
      setFeatureMutating(true);
      try {
        const feature = await adminService.createFeature(data);
        onSuccess?.(feature);
        return feature;
      } finally {
        setFeatureMutating(false);
      }
    },
    [],
  );

  const updateFeature = useCallback(
    async (
      id: string,
      data: {
        name?: string;
        description?: string;
        plans?: SubscriptionPlan[];
        enabled?: boolean;
      },
      onSuccess?: (feature: SaasFeature) => void,
    ) => {
      setFeatureMutating(true);
      try {
        const feature = await adminService.updateFeature(id, data);
        onSuccess?.(feature);
        return feature;
      } finally {
        setFeatureMutating(false);
      }
    },
    [],
  );

  const deleteFeature = useCallback(
    async (id: string, onSuccess?: () => void) => {
      setFeatureMutating(true);
      try {
        await adminService.deleteFeature(id);
        onSuccess?.();
      } finally {
        setFeatureMutating(false);
      }
    },
    [],
  );

  // ── Notifications système ──────────────────────────────────────────────────

  const [notifSending, setNotifSending] = useState(false);

  const sendSystemNotification = useCallback(
    async (
      data: {
        title: string;
        message: string;
        link?: string;
        targetRole?: "OWNER" | "all";
      },
      onSuccess?: (result: { sent: number }) => void,
    ) => {
      setNotifSending(true);
      try {
        const result = await adminService.sendSystemNotification(data);
        onSuccess?.(result);
        return result;
      } finally {
        setNotifSending(false);
      }
    },
    [],
  );

  // ─── Retour ───────────────────────────────────────────────────────────────

  return {
    // Dashboard
    dashboard: dashboardState.data,
    dashboardLoading: dashboardState.loading,
    dashboardError: dashboardState.error,
    fetchDashboard,

    // Analytics
    revenueAnalytics: revenueAnalyticsState.data,
    revenueAnalyticsLoading: revenueAnalyticsState.loading,
    fetchRevenueAnalytics,
    revenueByPlan: revenueByPlanState.data,
    revenueByPlanLoading: revenueByPlanState.loading,
    fetchRevenueByPlan,

    // Hôtels
    hotels: hotelsState.data,
    hotelsLoading: hotelsState.loading,
    hotelsError: hotelsState.error,
    fetchHotels,
    hotelDetail: hotelDetailState.data,
    hotelDetailLoading: hotelDetailState.loading,
    fetchHotelDetail,
    hotelMutating,
    suspendHotel,
    reactivateHotel,
    changeHotelPlan,

    // Abonnements
    subscriptions: subscriptionsState.data,
    subscriptionsLoading: subscriptionsState.loading,
    fetchSubscriptions,
    subscriptionStats: subscriptionStatsState.data,
    subscriptionStatsLoading: subscriptionStatsState.loading,
    fetchSubscriptionStats,

    // Paiements
    payments: paymentsState.data,
    paymentsLoading: paymentsState.loading,
    fetchPayments,

    // Utilisateurs
    users: usersState.data,
    usersLoading: usersState.loading,
    fetchUsers,

    // Séjours
    activeStays: staysState.data,
    activeStaysLoading: staysState.loading,
    fetchActiveStays,

    // Journaux
    logs: logsState.data,
    logsLoading: logsState.loading,
    fetchLogs,

    // Admins SaaS
    saasAdmins: adminsState.data,
    saasAdminsLoading: adminsState.loading,
    fetchSaasAdmins,
    adminMutating,
    promoteSaasAdmin,
    revokeSaasAdmin,

    // Catalogue plans
    plansCatalog: plansCatalogState.data,
    plansCatalogLoading: plansCatalogState.loading,
    fetchPlansCatalog,
    planDetail: planDetailState.data,
    planDetailLoading: planDetailState.loading,
    fetchPlanDetail,

    // Catalogue features
    features: featuresState.data,
    featuresLoading: featuresState.loading,
    fetchFeatures,
    featureMutating,
    createFeature,
    updateFeature,
    deleteFeature,

    // Notifications
    notifSending,
    sendSystemNotification,
  };
}
