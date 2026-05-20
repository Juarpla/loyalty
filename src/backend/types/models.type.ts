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
