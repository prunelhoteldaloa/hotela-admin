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
  SuperAdmin,
  CountryAdmin,
  AdminCountry,
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
  PlanConfig,
  UpdatePlanPayload,
  UpdatePlanFeaturePayload,
  CreatePlanFeaturePayload,
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

  // ── Super Admins ─────────────────────────────────────────────────────────────

  const superAdminsState = useAsync<SuperAdmin[]>();
  const [superAdminMutating, setSuperAdminMutating] = useState(false);

  const fetchSuperAdmins = useCallback(() => {
    return superAdminsState.execute(() => adminService.getSuperAdmins());
  }, [superAdminsState.execute]);

  const promoteSuperAdmin = useCallback(
    async (userId: string, onSuccess?: () => void) => {
      setSuperAdminMutating(true);
      try {
        await adminService.promoteSuperAdmin(userId);
        onSuccess?.();
      } finally {
        setSuperAdminMutating(false);
      }
    },
    [],
  );

  const revokeSuperAdmin = useCallback(
    async (userId: string, onSuccess?: () => void) => {
      setSuperAdminMutating(true);
      try {
        await adminService.revokeSuperAdmin(userId);
        onSuccess?.();
      } finally {
        setSuperAdminMutating(false);
      }
    },
    [],
  );

  // ── Country Admins ───────────────────────────────────────────────────────────

  const countryAdminsState = useAsync<CountryAdmin[]>();
  const [countryAdminMutating, setCountryAdminMutating] = useState(false);

  const fetchCountryAdmins = useCallback(() => {
    return countryAdminsState.execute(() => adminService.getCountryAdmins());
  }, [countryAdminsState.execute]);

  const promoteCountryAdmin = useCallback(
    async (userId: string, countryId: string, onSuccess?: () => void) => {
      setCountryAdminMutating(true);
      try {
        await adminService.promoteCountryAdmin(userId, countryId);
        onSuccess?.();
      } finally {
        setCountryAdminMutating(false);
      }
    },
    [],
  );

  const revokeCountryAdmin = useCallback(
    async (userId: string, onSuccess?: () => void) => {
      setCountryAdminMutating(true);
      try {
        await adminService.revokeCountryAdmin(userId);
        onSuccess?.();
      } finally {
        setCountryAdminMutating(false);
      }
    },
    [],
  );

  // ── Pays ───────────────────────────────────────────────────────────────────

  const countriesState = useAsync<AdminCountry[]>();

  const fetchCountries = useCallback(() => {
    return countriesState.execute(() => adminService.getAllCountries());
  }, [countriesState.execute]);

  // ── Configuration des plans ──────────────────────────────────────────────────

  const plansState = useAsync<PlanConfig[]>();
  const [planMutating, setPlanMutating] = useState(false);

  const fetchPlans = useCallback(() => {
    return plansState.execute(() => adminService.getPlans());
  }, [plansState.execute]);

  const updatePlan = useCallback(
    async (key: string, data: UpdatePlanPayload, onSuccess?: () => void) => {
      setPlanMutating(true);
      try {
        await adminService.updatePlan(key, data);
        onSuccess?.();
      } finally {
        setPlanMutating(false);
      }
    },
    [],
  );

  const updatePlanFeature = useCallback(
    async (
      key: string,
      featureKey: string,
      data: UpdatePlanFeaturePayload,
      onSuccess?: () => void,
    ) => {
      setPlanMutating(true);
      try {
        await adminService.updatePlanFeature(key, featureKey, data);
        onSuccess?.();
      } finally {
        setPlanMutating(false);
      }
    },
    [],
  );

  const addPlanFeature = useCallback(
    async (
      key: string,
      data: CreatePlanFeaturePayload,
      onSuccess?: () => void,
    ) => {
      setPlanMutating(true);
      try {
        await adminService.addPlanFeature(key, data);
        onSuccess?.();
      } finally {
        setPlanMutating(false);
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
    paymentsError: paymentsState.error,
    fetchPayments,

    // Utilisateurs
    users: usersState.data,
    usersLoading: usersState.loading,
    usersError: usersState.error,
    fetchUsers,

    // Séjours
    activeStays: staysState.data,
    activeStaysLoading: staysState.loading,
    fetchActiveStays,

    // Journaux
    logs: logsState.data,
    logsLoading: logsState.loading,
    logsError: logsState.error,
    fetchLogs,

    // Super Admins
    superAdmins: superAdminsState.data,
    superAdminsLoading: superAdminsState.loading,
    fetchSuperAdmins,
    superAdminMutating,
    promoteSuperAdmin,
    revokeSuperAdmin,

    // Country Admins
    countryAdmins: countryAdminsState.data,
    countryAdminsLoading: countryAdminsState.loading,
    fetchCountryAdmins,
    countryAdminMutating,
    promoteCountryAdmin,
    revokeCountryAdmin,

    // Pays
    countries: countriesState.data,
    countriesLoading: countriesState.loading,
    fetchCountries,

    // Configuration des plans
    plans: plansState.data,
    plansLoading: plansState.loading,
    plansError: plansState.error,
    fetchPlans,
    planMutating,
    updatePlan,
    updatePlanFeature,
    addPlanFeature,

    // Notifications
    notifSending,
    sendSystemNotification,
  };
}
