import { getApiClient } from "@/lib/api-client";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type SubscriptionPlan = "ESSENTIEL" | "MULTI" | "PREMIUM";

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIAL"
  | "PAST_DUE"
  | "SUSPENDED"
  | "CANCELLED";

export type UserRole = "ADMIN" | "OWNER" | "MANAGER" | "RECEPTIONIST";

export type StayStatus = "IN_PROGRESS" | "COMPLETED" | "EXTENDED" | "CANCELLED";

export type ActionLogType =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_PASSWORD_RESET"
  | "AUTH_EMAIL_VERIFIED"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "USER_ROLE_CHANGED"
  | "HOTEL_CREATED"
  | "HOTEL_UPDATED"
  | "HOTEL_DELETED"
  | "ROOM_TYPE_CREATED"
  | "ROOM_TYPE_UPDATED"
  | "ROOM_TYPE_DELETED"
  | "ROOM_CREATED"
  | "ROOM_UPDATED"
  | "ROOM_DELETED"
  | "ROOM_STATUS_CHANGED"
  | "ROOM_STATUS_TO_AVAILABLE"
  | "ROOM_STATUS_TO_OCCUPIED"
  | "ROOM_STATUS_TO_CLEANING"
  | "ROOM_STATUS_TO_MAINTENANCE"
  | "RESERVATION_CREATED"
  | "RESERVATION_UPDATED"
  | "RESERVATION_STATUS_CHANGED"
  | "RESERVATION_STATUS_TO_PENDING"
  | "RESERVATION_STATUS_TO_CONFIRMED"
  | "RESERVATION_STATUS_TO_COMPLETED"
  | "RESERVATION_STATUS_TO_CANCELLED"
  | "RESERVATION_STATUS_TO_NO_SHOW"
  | "STAY_STARTED"
  | "STAY_EXTENDED"
  | "STAY_COMPLETED"
  | "STAY_CANCELLED"
  | "STAY_STATUS_CHANGED"
  | "STAY_STATUS_TO_IN_PROGRESS"
  | "STAY_STATUS_TO_EXTENDED"
  | "STAY_STATUS_TO_COMPLETED"
  | "STAY_STATUS_TO_CANCELLED"
  | "INVOICE_CREATED"
  | "INVOICE_UPDATED"
  | "INVOICE_STATUS_CHANGED"
  | "INVOICE_STATUS_TO_PENDING"
  | "INVOICE_STATUS_TO_PARTIAL"
  | "INVOICE_STATUS_TO_PAID"
  | "INVOICE_STATUS_TO_OVERDUE"
  | "INVOICE_STATUS_TO_CANCELLED"
  | "CLIENT_CREATED"
  | "CLIENT_UPDATED"
  | "CLIENT_DELETED"
  | "CLIENT_VIP_STATUS_CHANGED"
  | "CLIENT_VIP_TO_STANDARD"
  | "CLIENT_VIP_TO_SILVER"
  | "CLIENT_VIP_TO_GOLD"
  | "CLIENT_VIP_TO_PLATINUM"
  | "CLIENT_NEWSLETTER_OPT_IN"
  | "CLIENT_NEWSLETTER_OPT_OUT"
  | "API_KEY_CREATED"
  | "API_KEY_REVOKED"
  | "API_KEY_ACCESSED"
  | "NEWSLETTER_CREATED"
  | "NEWSLETTER_UPDATED"
  | "WEBSITE_CREATED"
  | "WEBSITE_UPDATED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_PLAN_CHANGED"
  | "SUBSCRIPTION_PAYMENT_FAILED"
  | "SUBSCRIPTION_STATUS_CHANGED"
  | "SUBSCRIPTION_STATUS_TO_TRIAL"
  | "SUBSCRIPTION_STATUS_TO_ACTIVE"
  | "SUBSCRIPTION_STATUS_TO_PAST_DUE"
  | "SUBSCRIPTION_STATUS_TO_SUSPENDED"
  | "SUBSCRIPTION_STATUS_TO_CANCELLED"
  | "SYSTEM_ERROR";

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
  };
  revenue: {
    monthlyRecurringRevenue: number;
    lastMonthRevenue: number;
    mrrGrowthPercent: number | null;
  };
  planDistribution: {
    essentiel: number;
    multi: number;
    premium: number;
  };
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
    subscription?: {
      plan: SubscriptionPlan;
      status: SubscriptionStatus;
      amount: number;
      billingCycle: string;
      currentPeriodEnd: string;
      trialEndsAt: string | null;
    };
  };
  city: { name: string; country: { name: string } };
  _count: { rooms: number; reservations: number; clients: number };
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
    ownedHotels: { id: string; name: string }[];
  };
  payments: AdminPayment[];
}

export interface AdminPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  subscription: {
    plan: SubscriptionPlan;
    user: { id: string; name: string; email: string };
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  hotel: { id: string; name: string } | null;
  ownedHotels: { id: string; name: string }[];
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    currentPeriodEnd: string;
  } | null;
}

export interface AdminStay {
  id: string;
  stayNumber: string;
  guestName: string;
  guestEmail: string;
  startDate: string;
  endDate: string;
  status: StayStatus;
  totalAmount: number;
  paidAmount: number;
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
  ipAddress: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  hotel: { id: string; name: string } | null;
}

export interface SaasAdmin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isSaasAdmin: boolean;
}

export interface SaasFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  plans: SubscriptionPlan[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanCatalog {
  plan: SubscriptionPlan;
  activeSubscribers: number;
  trialSubscribers: number;
  totalRevenue: number;
}

export interface PlanDetail extends PlanCatalog {
  subscriptions: AdminSubscription[];
  totalPayments: number;
  statusBreakdown: Record<string, number>;
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
}

export interface LogQuery extends PaginationQuery {
  hotelId?: string;
  type?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

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

  // ── Admins SaaS ────────────────────────────────────────────────────────────

  getSaasAdmins(): Promise<SaasAdmin[]> {
    return getApiClient().get("/admin/admins");
  },

  promoteSaasAdmin(userId: string): Promise<SaasAdmin> {
    return getApiClient().post(`/admin/admins/${userId}/promote`);
  },

  revokeSaasAdmin(userId: string): Promise<SaasAdmin> {
    return getApiClient().post(`/admin/admins/${userId}/revoke`);
  },

  // ── Catalogue plans ────────────────────────────────────────────────────────

  getPlansCatalog(): Promise<PlanCatalog[]> {
    return getApiClient().get("/admin/catalog/plans");
  },

  getPlanDetail(plan: SubscriptionPlan): Promise<PlanDetail> {
    return getApiClient().get(`/admin/catalog/plans/${plan}`);
  },

  // ── Catalogue features ─────────────────────────────────────────────────────

  getFeaturesCatalog(): Promise<SaasFeature[]> {
    return getApiClient().get("/admin/catalog/features");
  },

  createFeature(data: {
    name: string;
    description: string;
    plans: SubscriptionPlan[];
    enabled?: boolean;
  }): Promise<SaasFeature> {
    return getApiClient().post("/admin/catalog/features", data);
  },

  updateFeature(
    id: string,
    data: {
      name?: string;
      description?: string;
      plans?: SubscriptionPlan[];
      enabled?: boolean;
    },
  ): Promise<SaasFeature> {
    return getApiClient().patch(`/admin/catalog/features/${id}`, data);
  },

  deleteFeature(id: string): Promise<{ message: string }> {
    return getApiClient().delete(`/admin/catalog/features/${id}`);
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
