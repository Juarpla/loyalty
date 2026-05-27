import { supabaseModel } from "./supabase.model";
import {
  DatabaseClient,
  TrafficRecord,
  CustomerSegmentationResult,
  CustomerSegment,
  SegmentedCustomer,
  TransactionRecord,
  PortalArrivalRecord,
  SEGMENTATION_THRESHOLDS
} from "../types/models.type";
import { logger } from "../utils/logger.utils";

/**
 * Isolated Customer & Traffic Data Queries Model
 */
export class ClientModel {
  /**
   * Fetch active traffic records
   */
  static async getTrafficHistory(): Promise<TrafficRecord[]> {
    logger.info("ClientModel.getTrafficHistory invoked");
    const mockTraffic: TrafficRecord[] = [
      {
        id: "tr-101",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        ipAddress: "192.168.1.12",
        deviceType: "mobile",
        connectedToWifi: true,
        notes: "iPhone 14 connected to Loyalty Gateway"
      },
      {
        id: "tr-102",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        ipAddress: "192.168.1.45",
        deviceType: "desktop",
        connectedToWifi: false,
        notes: "Client page visited (no Wifi link)"
      },
      {
        id: "tr-103",
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        ipAddress: "192.168.1.88",
        deviceType: "tablet",
        connectedToWifi: true,
        notes: "Android tablet auto-login"
      }
    ];

    return supabaseModel.executeQuery<TrafficRecord[]>("getTrafficHistory", mockTraffic);
  }

  /**
   * Save a newly identified client
   */
  static async createClient(name: string, phone: string, email?: string): Promise<DatabaseClient> {
    logger.info("ClientModel.createClient invoked", { name, phone, email });
    const mockClient: DatabaseClient = {
      id: `cli-${Math.random().toString(36).substr(2, 9)}`,
      name,
      phone,
      email,
      createdAt: new Date().toISOString(),
      visitCount: 1
    };

    return supabaseModel.executeQuery<DatabaseClient>("createClient", mockClient);
  }

  /**
   * Register a portal login (upsert client and insert login record)
   */
  static async registerPortalLogin(phone_number: string, name?: string): Promise<{
    clientId: string;
    loginId: string;
  }> {
    logger.info("ClientModel.registerPortalLogin invoked", { phone_number, name });
    const status = supabaseModel.getStatus();

    if (status.mode === "offline_simulation") {
      const mockResult = {
        clientId: `cli-${Math.random().toString(36).substr(2, 9)}`,
        loginId: `log-${Math.random().toString(36).substr(2, 9)}`
      };
      return supabaseModel.executeQuery("registerPortalLogin", mockResult);
    }

    try {
      const client = supabaseModel.getClient();
      
      // Upsert client
      const { data: clientData, error: clientError } = await client
        .from("clients")
        .upsert(
          { phone_number, ...(name ? { name } : {}) },
          { onConflict: 'phone_number' }
        )
        .select('id')
        .single();

      if (clientError) {
        throw clientError;
      }

      const clientId = clientData.id;

      // Insert wifi login log
      const { data: loginData, error: loginError } = await client
        .from("wifi_logins")
        .insert({ client_id: clientId })
        .select('id')
        .single();

      if (loginError) {
        throw loginError;
      }

      return {
        clientId,
        loginId: loginData.id
      };
    } catch (err: unknown) {
      const error = err as Error;
      logger.error("Exception in ClientModel.registerPortalLogin", error);

      if (
        error.message?.includes("fetch failed") ||
        error.message?.includes("ECONNREFUSED") ||
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("NetworkError")
      ) {
        throw new Error("DB_CONNECTION_FAILURE");
      }

      const errorCode = (err as Record<string, unknown>)?.code;
      throw new Error(typeof errorCode === "string" ? errorCode : "DB_QUERY_ERROR");
    }
  }

  /**
   * Fetch recent captive portal arrivals for manager notifications.
   */
  static async getRecentPortalArrivals(limit: number = 10): Promise<PortalArrivalRecord[]> {
    logger.info("ClientModel.getRecentPortalArrivals invoked", { limit });
    const status = supabaseModel.getStatus();

    if (status.mode === "offline_simulation") {
      const now = Date.now();
      const mockArrivals: PortalArrivalRecord[] = [
        {
          clientId: "cli-arrival-001",
          loginId: "log-arrival-001",
          phone_number: "+51900111222",
          name: "Ana Torres",
          arrivedAt: new Date(now - 2 * 60 * 1000).toISOString(),
        },
        {
          clientId: "cli-arrival-002",
          loginId: "log-arrival-002",
          phone_number: "+51900333444",
          name: null,
          arrivedAt: new Date(now - 8 * 60 * 1000).toISOString(),
        },
      ].slice(0, limit);

      return supabaseModel.executeQuery<PortalArrivalRecord[]>(
        "getRecentPortalArrivals",
        mockArrivals
      );
    }

    try {
      const client = supabaseModel.getClient();
      const { data, error } = await client
        .from("wifi_logins")
        .select("id, created_at, clients(id, phone_number, name)")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        logger.error("Database error in ClientModel.getRecentPortalArrivals", error);

        if (
          error.message?.includes("fetch failed") ||
          error.message?.includes("ECONNREFUSED") ||
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("NetworkError")
        ) {
          throw new Error("DB_CONNECTION_FAILURE");
        }

        throw new Error(error.code || "DB_QUERY_ERROR");
      }

      type SupabaseArrivalRow = {
        id: string;
        created_at: string | null;
        clients: {
          id: string;
          phone_number: string;
          name: string | null;
        } | null;
      };

      const rows = (data ?? []) as SupabaseArrivalRow[];

      return rows
        .filter((row) => row.clients !== null)
        .map((row) => ({
          clientId: row.clients?.id ?? "",
          loginId: row.id,
          phone_number: row.clients?.phone_number ?? "",
          name: row.clients?.name ?? null,
          arrivedAt: row.created_at ?? new Date(0).toISOString(),
        }));
    } catch (err: unknown) {
      const error = err as Error;
      logger.error("Exception in ClientModel.getRecentPortalArrivals", error);

      if (
        error.message?.includes("fetch failed") ||
        error.message?.includes("ECONNREFUSED") ||
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("NetworkError")
      ) {
        throw new Error("DB_CONNECTION_FAILURE");
      }

      throw error;
    }
  }

  /**
   * Compute customer segmentation from raw transaction records.
   * Assigns mutually exclusive segment tags with priority: inactive_30d > frequent > high_spender.
   */
  private static computeSegments(
    transactions: TransactionRecord[],
    clientNames: { phone_number: string; name: string }[]
  ): CustomerSegmentationResult {
    const now = Date.now();
    const nameMap = new Map<string, string>();
    for (const c of clientNames) {
      nameMap.set(c.phone_number, c.name);
    }

    const customerAggs = new Map<string, {
      phone_number: string;
      visit_count: number;
      total_amount: number;
      last_transaction_date: string | null;
    }>();

    for (const txn of transactions) {
      const existing = customerAggs.get(txn.phone_number);
      if (existing) {
        existing.visit_count++;
        existing.total_amount += txn.amount;
        if (!existing.last_transaction_date || txn.created_at > existing.last_transaction_date) {
          existing.last_transaction_date = txn.created_at;
        }
      } else {
        customerAggs.set(txn.phone_number, {
          phone_number: txn.phone_number,
          visit_count: 1,
          total_amount: txn.amount,
          last_transaction_date: txn.created_at,
        });
      }
    }

    for (const c of clientNames) {
      if (!customerAggs.has(c.phone_number)) {
        customerAggs.set(c.phone_number, {
          phone_number: c.phone_number,
          visit_count: 0,
          total_amount: 0,
          last_transaction_date: null,
        });
      }
    }

    const segments: SegmentedCustomer[] = [];
    for (const [, agg] of customerAggs) {
      const average_ticket = agg.visit_count > 0
        ? Number((agg.total_amount / agg.visit_count).toFixed(2))
        : 0;

      let segment: CustomerSegment | null = null;
      const lastDate = agg.last_transaction_date
        ? new Date(agg.last_transaction_date).getTime()
        : null;

      if (
        lastDate === null ||
        (now - lastDate) > SEGMENTATION_THRESHOLDS.INACTIVE_DAYS * 24 * 60 * 60 * 1000
      ) {
        segment = 'inactive_30d';
      } else if (agg.visit_count >= SEGMENTATION_THRESHOLDS.FREQUENT_VISIT_COUNT) {
        segment = 'frequent';
      } else if (average_ticket >= SEGMENTATION_THRESHOLDS.HIGH_SPENDER_MIN_TICKET) {
        segment = 'high_spender';
      }

      segments.push({
        phone_number: agg.phone_number,
        name: nameMap.get(agg.phone_number) || '',
        visit_count: agg.visit_count,
        average_ticket,
        last_transaction_date: agg.last_transaction_date,
        segment,
      });
    }

    const summary: Record<CustomerSegment | 'unassigned', number> = {
      inactive_30d: 0,
      frequent: 0,
      high_spender: 0,
      unassigned: 0,
    };

    for (const s of segments) {
      if (s.segment) {
        summary[s.segment]++;
      } else {
        summary.unassigned++;
      }
    }

    return { segments, summary };
  }

  /**
   * Fetch all customers and compute segmentation based on transaction history.
   * Uses offline simulation data when Supabase credentials are not configured.
   */
  static async getCustomerSegments(): Promise<CustomerSegmentationResult> {
    logger.info("ClientModel.getCustomerSegments invoked");

    const status = supabaseModel.getStatus();

    if (status.mode === "offline_simulation") {
      const mockTransactions: TransactionRecord[] = [
        {
          id: "txn-b001",
          phone_number: "+51900222000",
          amount: 20,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-c001",
          phone_number: "+51900333000",
          amount: 25,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-c002",
          phone_number: "+51900333000",
          amount: 30,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-c003",
          phone_number: "+51900333000",
          amount: 35,
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-c004",
          phone_number: "+51900333000",
          amount: 20,
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-c005",
          phone_number: "+51900333000",
          amount: 40,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-d001",
          phone_number: "+51900444000",
          amount: 55,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-d002",
          phone_number: "+51900444000",
          amount: 60,
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-d003",
          phone_number: "+51900444000",
          amount: 65,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-e001",
          phone_number: "+51900555000",
          amount: 20,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-e002",
          phone_number: "+51900555000",
          amount: 25,
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "txn-e003",
          phone_number: "+51900555000",
          amount: 30,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      const mockClients: { phone_number: string; name: string }[] = [
        { phone_number: "+51900111000", name: "Alice García" },
        { phone_number: "+51900222000", name: "Bob Martínez" },
        { phone_number: "+51900333000", name: "Charlie López" },
        { phone_number: "+51900444000", name: "Diana Torres" },
        { phone_number: "+51900555000", name: "Eve Ramírez" },
      ];

      return supabaseModel.executeQuery<CustomerSegmentationResult>(
        "getCustomerSegments",
        this.computeSegments(mockTransactions, mockClients)
      );
    }

    try {
      const client = supabaseModel.getClient();
      const { data, error } = await client
        .from("sales_transactions")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        logger.error("Database error in ClientModel.getCustomerSegments", error);

        if (
          error.message.includes("fetch failed") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          throw new Error("DB_CONNECTION_FAILURE");
        }

        throw new Error(error.code || "DB_QUERY_ERROR");
      }

      const transactions: TransactionRecord[] = (data || []).map((row) => ({
        id: row.id,
        phone_number: row.phone_number,
        amount: Number(row.amount),
        created_at: row.created_at,
      }));

      return this.computeSegments(transactions, []);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error("Exception in ClientModel.getCustomerSegments", error);

      if (
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error("DB_CONNECTION_FAILURE");
      }

      throw error;
    }
  }

  static async getWifiLoginCount(clientId: string): Promise<number> {
    logger.info("ClientModel.getWifiLoginCount invoked", { clientId });

    if (!clientId || clientId.trim() === "") {
      throw new Error("INVALID_CLIENT_ID");
    }

    const status = supabaseModel.getStatus();

    if (status.mode === "offline_simulation") {
      const match = clientId.match(/-count-(\d+)/);
      const count = match ? parseInt(match[1], 10) : 10;
      return supabaseModel.executeQuery<number>("getWifiLoginCount", count);
    }

    try {
      const client = supabaseModel.getClient();
      const { count, error } = await client
        .from("wifi_logins")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId);

      if (error) {
        logger.error("Database error in ClientModel.getWifiLoginCount", error);

        if (
          error.message?.includes("fetch failed") ||
          error.message?.includes("ECONNREFUSED") ||
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("NetworkError")
        ) {
          throw new Error("DB_CONNECTION_FAILURE");
        }

        throw new Error(error.code || "DB_QUERY_ERROR");
      }

      return count ?? 0;
    } catch (err: unknown) {
      const error = err as Error;
      logger.error("Exception in ClientModel.getWifiLoginCount", error);

      if (
        error.message?.includes("fetch failed") ||
        error.message?.includes("ECONNREFUSED") ||
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("NetworkError")
      ) {
        throw new Error("DB_CONNECTION_FAILURE");
      }

      if (error.message === "INVALID_CLIENT_ID" || error.message === "DB_QUERY_ERROR" || error.message === "DB_CONNECTION_FAILURE") {
        throw error;
      }

      throw new Error("DB_QUERY_ERROR");
    }
  }
}

