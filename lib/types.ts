export type UserRole =
  | "SUPER_ADMIN"
  | "COUNTRY_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "OWNER"
  | "RECEPTIONIST"
  | "CASHIER";
export interface Room {
  id: string;
  number: string;
  type: RoomType;
  typeId: string;
  status: RoomStatus;
  price: number;
  capacity: number;
  floor: number;
}

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE";
export interface RoomType {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  capacity: number;
  equipments: string[];
}

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";
  totalAmount: number;
  paidAmount: number;
  paymentMethod: "cash" | "mobile-money" | "card" | "transfer";
  createdAt: string;
}

export interface Invoice {
  id: string;
  reservationId: string;
  guestName: string;
  amount: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "partial" | "overdue";
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  totalRooms: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotelId: string;
  avatar?: string;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  monthlyRevenue: number;
  pendingInvoices: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  hotelId: string;
  permissions: (
    | "reservations:read"
    | "reservations:write"
    | "rooms:read"
    | "rooms:write"
    | "availability:read"
  )[];
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  status: "active" | "revoked" | "expired";
  requestsToday: number;
  requestsTotal: number;
}
export interface SaasHotelAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  plan: "essentiel" | "multi" | "premium";
  status: "active" | "suspended" | "trial" | "cancelled";
  createdAt: string;
  trialEndsAt: string | null;
  totalRooms: number;
  totalReservations: number;
  monthlyRevenue: number;
  lastPaymentAt: string | null;
  nextBillingAt: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
}

export interface SaasSubscription {
  id: string;
  hotelId: string;
  hotelName: string;
  plan: "essentiel" | "multi" | "premium";
  status: "active" | "past_due" | "cancelled" | "trialing";
  amount: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface SaasPayment {
  id: string;
  hotelId: string;
  hotelName: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  paymentMethod: "mobile-money" | "card" | "transfer";
  createdAt: string;
  description: string;
}

export interface SaasStats {
  totalHotels: number;
  activeHotels: number;
  trialHotels: number;
  suspendedHotels: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  totalReservations: number;
  totalRooms: number;
  planDistribution: {
    essentiel: number;
    multi: number;
    premium: number;
  };
}

export interface SaasFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  plans: ("essentiel" | "multi" | "premium")[];
  createdAt: string;
}
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  totalStays: number;
  totalSpent: number;
  lastStay: string | null;
  firstStay: string;
  vipStatus: "standard" | "silver" | "gold" | "platinum";
  tags: string[];
  notes?: string;
  newsletter: boolean;
  createdAt: string;
}

export interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  recipients: number;
  openRate?: number;
  clickRate?: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  phone?: string;
  address?: string | null;
  role: "ADMIN" | "MANAGER" | "OWNER" | "RECEPTIONIST";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  hotels?: Hotel[];
}
