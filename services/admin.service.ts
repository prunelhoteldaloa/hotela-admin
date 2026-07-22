import { getApiClient } from "@/lib/api-client";

// ─── Enums (alignés sur le schéma Prisma du backend) ───────────────────────────

export type SubscriptionPlan =
  // Anciens identifiants (rétrocompatibilité)
  | "ESSENTIEL"
  | "MULTI"
  | "PREMIUM"
  // Nouvelle grille (4 packs)
  | "LIGHT"
  | "STARTER"
  | "BUSINESS"
  | "CORPORATE";

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIAL"
  | "PAST_DUE"
  | "SUSPENDED"
  | "CANCELLED";

export type UserRole =
  | "SUPER_ADMIN"
  | "COUNTRY_ADMIN"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "RECEPTIONIST"
  | "CASHIER";

export type StayStatus = "IN_PROGRESS" | "COMPLETED" | "EXTENDED" | "CANCELLED";

export type ActionLogType = string;

// ─── Types communs ────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface CountryRef {
  id: string;
  name: string;
}

// ─── Types métier ─────────────────────────────────────────────────────────────

export interface DashboardStats {
  overview: {
    totalHotels: number;
    activeSubscriptions: number;
    trialSubscriptions: number;
    suspendedSubscriptions: number;
    cancelledSubscriptions: number;
    pastDueSubscriptions: number;
    totalReservations: number;
    totalRooms: number;
    totalClients: number;
    totalStays: number;
    totalInvoices: number;
    totalCountryAdmins: number;
    totalSuperAdmins: number;
  };
  revenue: {
    monthlyRecurringRevenue: number;
    lastMonthRevenue: number;
    mrrGrowthPercent: number | null;
  };
  /** Dictionnaire dynamique : clé = plan en minuscules, valeur = nombre d'abonnements */
  planDistribution: Record<string, number>;
  recentHotels: AdminHotel[];
  recentPayments: AdminPayment[];
}

export interface AdminHotel {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string | null;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subscription?: {
      plan: SubscriptionPlan;
      status: SubscriptionStatus;
      amount?: number;
      billingCycle?: string;
      currentPeriodEnd: string;
      trialEndsAt: string | null;
    } | null;
  };
  city: { name: string; country: { id: string; name: string } };
  _count: {
    rooms: number;
    reservations: number;
    clients: number;
    stays?: number;
  };
}

export interface AdminSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  billingCycle: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    ownedHotels: {
      id: string;
      name: string;
      city?: { name: string; country: { name: string } };
    }[];
  };
  payments: AdminPayment[];
}

export interface AdminPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  description?: string | null;
  transactionId?: string | null;
  createdAt: string;
  subscription: {
    plan?: SubscriptionPlan;
    user: { id: string; name: string; email: string };
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  createdAt: string;
  hotel: { id: string; name: string } | null;
  ownedHotels: {
    id: string;
    name: string;
    city?: { name: string; country: { name: string } };
  }[];
  country: CountryRef | null;
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    currentPeriodEnd: string;
    trialEndsAt: string | null;
  } | null;
}

export interface AdminStay {
  id: string;
  startDate: string;
  endDate: string;
  status: StayStatus;
  hotel: { id: string; name: string };
  room: { id: string; number: string };
  client: { id: string; name: string; email: string } | null;
}

export interface ActionLog {
  id: string;
  type: ActionLogType;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role?: UserRole } | null;
  hotel: { id: string; name: string } | null;
}

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isSaasAdmin: boolean;
  createdAt: string;
}

export interface CountryAdmin {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  country: CountryRef | null;
}

export interface AdminCountry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: { cities: number };
  admins: { id: string; name: string; email: string }[];
}

export interface RevenueMonth {
  month: string;
  revenue: number;
  count: number;
}

export interface RevenueByPlan {
  plan: SubscriptionPlan;
  totalRevenue: number;
  paymentsCount: number;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  trial: number;
  suspended: number;
  cancelled: number;
  pastDue: number;
  monthlyRevenue: number;
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface HotelQuery extends PaginationQuery {
  status?: string;
  plan?: string;
  search?: string;
  countryId?: string;
}

export interface SubscriptionQuery extends PaginationQuery {
  status?: string;
  plan?: string;
  search?: string;
}

export interface PaymentQuery extends PaginationQuery {
  status?: string;
  search?: string;
}

export interface UserQuery extends PaginationQuery {
  role?: string;
  search?: string;
  countryId?: string;
}

export interface LogQuery extends PaginationQuery {
  hotelId?: string;
  type?: string;
  userId?: string;
}

export interface HotelsByCountryResponse extends PaginatedResponse<AdminHotel> {
  country: { id: string; name: string };
}

// ─── Service ──────────────────────────────────────────────────────────────────
// Toutes les routes sont préfixées par la base URL configurée (ex: /v1),
// puis /admin/... conformément au AdminController NestJS.

export const adminService = {
  // ── Dashboard ──────────────────────────────────────────────────────────────

  getDashboardStats(): Promise<DashboardStats> {
    return getApiClient().get("/admin/dashboard");
  },

  // ── Analytics ──────────────────────────────────────────────────────────────

  getRevenueAnalytics(months = 12): Promise<RevenueMonth[]> {
    return getApiClient().get("/admin/analytics/revenue", {
      params: { months },
    });
  },

  getRevenueByPlan(): Promise<RevenueByPlan[]> {
    return getApiClient().get("/admin/analytics/revenue-by-plan");
  },

  // ── Hôtels ─────────────────────────────────────────────────────────────────

  getAllHotels(query: HotelQuery = {}): Promise<PaginatedResponse<AdminHotel>> {
    return getApiClient().get("/admin/hotels", { params: query });
  },

  getHotelDetails(id: string): Promise<AdminHotel> {
    return getApiClient().get(`/admin/hotels/${id}`);
  },

  suspendHotel(id: string, reason: string): Promise<{ message: string }> {
    return getApiClient().post(`/admin/hotels/${id}/suspend`, { reason });
  },

  reactivateHotel(id: string): Promise<{ message: string }> {
    return getApiClient().post(`/admin/hotels/${id}/reactivate`);
  },

  changeHotelPlan(
    id: string,
    plan: SubscriptionPlan,
  ): Promise<{ message: string }> {
    return getApiClient().patch(`/admin/hotels/${id}/plan`, { plan });
  },

  // ── Abonnements ────────────────────────────────────────────────────────────

  getAllSubscriptions(
    query: SubscriptionQuery = {},
  ): Promise<PaginatedResponse<AdminSubscription>> {
    return getApiClient().get("/admin/subscriptions", { params: query });
  },

  getSubscriptionStats(): Promise<SubscriptionStats> {
    return getApiClient().get("/admin/subscriptions/stats");
  },

  // ── Paiements ──────────────────────────────────────────────────────────────

  getAllPayments(
    query: PaymentQuery = {},
  ): Promise<PaginatedResponse<AdminPayment>> {
    return getApiClient().get("/admin/payments", { params: query });
  },

  // ── Utilisateurs ───────────────────────────────────────────────────────────

  getAllUsers(query: UserQuery = {}): Promise<PaginatedResponse<AdminUser>> {
    return getApiClient().get("/admin/users", { params: query });
  },

  // ── Séjours ────────────────────────────────────────────────────────────────

  getActiveStays(
    query: PaginationQuery = {},
  ): Promise<PaginatedResponse<AdminStay>> {
    return getApiClient().get("/admin/stays/active", { params: query });
  },

  // ── Journaux ───────────────────────────────────────────────────────────────

  getActionLogs(query: LogQuery = {}): Promise<PaginatedResponse<ActionLog>> {
    return getApiClient().get("/admin/logs", { params: query });
  },

  // ── Super Admins (SUPER_ADMIN = admins SaaS) ─────────────────────────────────

  getSuperAdmins(): Promise<SuperAdmin[]> {
    return getApiClient().get("/admin/super-admins");
  },

  promoteSuperAdmin(userId: string): Promise<SuperAdmin> {
    return getApiClient().post(`/admin/super-admins/${userId}/promote`);
  },

  revokeSuperAdmin(userId: string): Promise<SuperAdmin> {
    return getApiClient().post(`/admin/super-admins/${userId}/revoke`);
  },

  // ── Country Admins ───────────────────────────────────────────────────────────

  getCountryAdmins(): Promise<CountryAdmin[]> {
    return getApiClient().get("/admin/country-admins");
  },

  promoteCountryAdmin(
    userId: string,
    countryId: string,
  ): Promise<CountryAdmin> {
    return getApiClient().post(`/admin/country-admins/${userId}/promote`, {
      countryId,
    });
  },

  revokeCountryAdmin(userId: string): Promise<CountryAdmin> {
    return getApiClient().post(`/admin/country-admins/${userId}/revoke`);
  },

  // ── Pays ─────────────────────────────────────────────────────────────────────

  getAllCountries(): Promise<AdminCountry[]> {
    return getApiClient().get("/admin/countries");
  },

  getHotelsByCountry(
    countryId: string,
    query: { page?: number; limit?: number; search?: string } = {},
  ): Promise<HotelsByCountryResponse> {
    return getApiClient().get(`/admin/countries/${countryId}/hotels`, {
      params: query,
    });
  },

  // ── Notifications système ──────────────────────────────────────────────────

  sendSystemNotification(data: {
    title: string;
    message: string;
    link?: string;
    targetRole?: "OWNER" | "all";
  }): Promise<{ sent: number }> {
    return getApiClient().post("/admin/notifications/system", data);
  },
};
