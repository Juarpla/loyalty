/**
 * Decoupled Database Interfaces and Type Definitions
 */

export interface DatabaseClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  lastVisitAt?: string;
  visitCount: number;
}

export interface TrafficRecord {
  id: string;
  timestamp: string;
  ipAddress?: string;
  macAddress?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  connectedToWifi: boolean;
  notes?: string;
}

export interface AIAnalysisReport {
  id: string;
  generatedAt: string;
  reportDate: string;
  summary: string;
  insights: string[];
  recommendations: string[];
}

export interface SalesTransaction {
  id: string;
  phone_number: string;
  amount: number;
  created_at: string;
}

export interface SalesAggregate {
  phone_number: string;
  visit_count: number;
  average_ticket: number;
}

export interface TransactionRecord {
  id: string;
  phone_number: string;
  amount: number;
  created_at: string;
}

export interface TrafficDistribution {
  hours: number[];
  weekdays: number[];
  peakHour: number;
  peakWeekday: number;
  totalTransactions: number;
}

export interface WeekVisitCount {
  weekLabel: string;
  weekStart: string;
  weekEnd: string;
  totalVisits: number;
  weekendVisits: number;
}

export interface WeekendRatio {
  currentWeek: string;
  previousWeek: string;
  visitRatio: number;
  percentageChange: number;
}

export interface PredictionResult {
  status: "active" | "inactive";
  dataSpanDays: number;
  weekVisits: WeekVisitCount[];
  weekendRatios: WeekendRatio[];
  projectedWeekendShift: "increasing" | "decreasing" | "stable";
}

export type CustomerSegment = 'inactive_30d' | 'high_spender' | 'frequent';

export interface SegmentedCustomer {
  phone_number: string;
  name: string;
  visit_count: number;
  average_ticket: number;
  last_transaction_date: string | null;
  segment: CustomerSegment | null;
}

export interface CustomerSegmentationResult {
  segments: SegmentedCustomer[];
  summary: Record<CustomerSegment | 'unassigned', number>;
}

export interface GeminiRecoveryPromptInput {
  customer: SegmentedCustomer;
  businessName?: string;
}

export interface GeminiRecoveryPromptResult {
  phone_number: string;
  recoveryCopy: string;
  generatedAt: string;
}

export interface SocialIdea {
  title: string;
  body: string;
  visualPrompt: string;
  hashtags: string[];
}

export interface ArrivalNotificationInput {
  phone_number: string;
  name?: string;
  businessName?: string;
}

export interface ArrivalNotification {
  phone_number: string;
  name: string;
  greetingText: string;
  whatsappUrl: string;
  generatedAt: string;
}

export interface PortalArrivalRecord {
  clientId: string;
  loginId: string;
  phone_number: string;
  name: string | null;
  arrivedAt: string;
}

export interface ArrivalNotificationWithMeta extends ArrivalNotification {
  clientId: string;
  loginId: string;
  arrivedAt: string;
}

export interface ArrivalNotificationsSummary {
  total: number;
  named: number;
  anonymous: number;
  generatedAt: string;
  latestArrivalAt: string | null;
}

export interface ArrivalNotificationsResult {
  notifications: ArrivalNotificationWithMeta[];
  summary: ArrivalNotificationsSummary;
}

export type ArrivalControllerResponse =
  | { success: true; data: ArrivalNotificationsResult }
  | { success: false; status: number; error: string };

export const SEGMENTATION_THRESHOLDS = {
  INACTIVE_DAYS: 30,
  FREQUENT_VISIT_COUNT: 5,
  HIGH_SPENDER_MIN_TICKET: 50,
} as const;

export const SOCIAL_POST_LIMITS = {
  TITLE_MAX: 80,
  BODY_MAX: 280,
  VISUAL_PROMPT_MAX: 200,
  HASHTAGS_MAX: 5,
  HASHTAG_MAX_LENGTH: 30,
  MAX_IDEAS: 3,
} as const;
