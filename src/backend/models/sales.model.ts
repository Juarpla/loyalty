import { supabaseModel } from "./supabase.model";
import { SalesTransaction, SalesAggregate, TransactionRecord } from "../types/models.type";
import { logger } from "../utils/logger.utils";

/**
 * Isolated Sales & Transaction Data Operations Model
 */
export class SalesModel {
  /**
   * Insert a sales transaction record into Supabase
   * Maps to public.sales_transactions table
   */
  static async insertTransaction(phoneNumber: string, amount: number): Promise<SalesTransaction> {
    logger.info("SalesModel.insertTransaction invoked", { phoneNumber, amount });

    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }
    if (amount === undefined || amount === null) {
      throw new Error("Amount is required");
    }

    const status = supabaseModel.getStatus();

    // Offline / Simulation fallback mode
    if (status.mode === "offline_simulation") {
      const mockRecord: SalesTransaction = {
        id: `txn-${Math.random().toString(36).substr(2, 9)}`,
        phone_number: phoneNumber,
        amount,
        created_at: new Date().toISOString()
      };
      return supabaseModel.executeQuery<SalesTransaction>("insertTransaction", mockRecord);
    }

    // Production / Database connected mode
    try {
      const client = supabaseModel.getClient();
      const { data, error } = await client
        .from("sales_transactions")
        .insert({
          phone_number: phoneNumber,
          amount
        })
        .select()
        .single();

      if (error) {
        logger.error("Database error in SalesModel.insertTransaction", error);

        const isConnectionRefused = error.message && (
          error.message.includes("fetch failed") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        );

        if (isConnectionRefused) {
          throw new Error("DB_CONNECTION_FAILURE");
        }

        throw new Error(error.code || "DB_INSERT_ERROR");
      }

      if (!data) {
        throw new Error("NO_DATA_RETURNED");
      }

      return {
        id: data.id,
        phone_number: data.phone_number,
        amount: Number(data.amount),
        created_at: data.created_at
      } as SalesTransaction;
    } catch (err: unknown) {
      const error = err as Error;
      logger.error("Exception in SalesModel.insertTransaction", error);

      // Detect network connection errors or fetch failures
      const isConnectionRefused = error.message && (
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      );

      if (isConnectionRefused) {
        throw new Error("DB_CONNECTION_FAILURE");
      }

      throw error;
    }
  }

  /**
   * Fetch all transaction records for metrics aggregation
   */
  static async getAllTransactions(): Promise<TransactionRecord[]> {
    logger.info("SalesModel.getAllTransactions invoked");

    const status = supabaseModel.getStatus();

    // Offline / Simulation fallback mode
    if (status.mode === "offline_simulation") {
      const mockRecords: TransactionRecord[] = [
        {
          id: "txn-001",
          phone_number: "+51900111000",
          amount: 45.5,
          created_at: new Date(Date.UTC(2026, 4, 15, 10, 30, 0)).toISOString()
        },
        {
          id: "txn-002",
          phone_number: "+51900222000",
          amount: 32.0,
          created_at: new Date(Date.UTC(2026, 4, 15, 14, 15, 0)).toISOString()
        },
        {
          id: "txn-003",
          phone_number: "+51900333000",
          amount: 78.25,
          created_at: new Date(Date.UTC(2026, 4, 16, 9, 0, 0)).toISOString()
        }
      ];
      return supabaseModel.executeQuery<TransactionRecord[]>("getAllTransactions", mockRecords);
    }

    // Production / Database connected mode
    try {
      const client = supabaseModel.getClient();
      const { data, error } = await client
        .from("sales_transactions")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        logger.error("Database error in SalesModel.getAllTransactions", error);

        const isConnectionRefused = error.message && (
          error.message.includes("fetch failed") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        );

        if (isConnectionRefused) {
          throw new Error("DB_CONNECTION_FAILURE");
        }

        throw new Error(error.code || "DB_QUERY_ERROR");
      }

      return (data || []).map((row) => ({
        id: row.id,
        phone_number: row.phone_number,
        amount: Number(row.amount),
        created_at: row.created_at
      })) as TransactionRecord[];
    } catch (err: unknown) {
      const error = err as Error;
      logger.error("Exception in SalesModel.getAllTransactions", error);

      const isConnectionRefused = error.message && (
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      );

      if (isConnectionRefused) {
        throw new Error("DB_CONNECTION_FAILURE");
      }

      throw error;
    }
  }

  /**
   * Fetch transaction aggregates for a customer by their phone number
   */
  static async getSalesAggregate(phoneNumber: string): Promise<SalesAggregate> {
    logger.info("SalesModel.getSalesAggregate invoked", { phoneNumber });

    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }

    const status = supabaseModel.getStatus();

    // Offline / Simulation fallback mode
    if (status.mode === "offline_simulation") {
      let mockAggregate: SalesAggregate;
      if (phoneNumber === "123456789") {
        mockAggregate = {
          phone_number: phoneNumber,
          visit_count: 5,
          average_ticket: 25.5
        };
      } else {
        mockAggregate = {
          phone_number: phoneNumber,
          visit_count: 0,
          average_ticket: 0
        };
      }
      return supabaseModel.executeQuery<SalesAggregate>("getSalesAggregate", mockAggregate);
    }

    // Production / Database connected mode
    try {
      const client = supabaseModel.getClient();
      const { data, error } = await client
        .from("sales_transactions")
        .select("amount")
        .eq("phone_number", phoneNumber);

      if (error) {
        logger.error("Database error in SalesModel.getSalesAggregate", error);

        const isConnectionRefused = error.message && (
          error.message.includes("fetch failed") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        );

        if (isConnectionRefused) {
          throw new Error("DB_CONNECTION_FAILURE");
        }

        throw new Error(error.code || "DB_QUERY_ERROR");
      }

      if (!data || data.length === 0) {
        return {
          phone_number: phoneNumber,
          visit_count: 0,
          average_ticket: 0
        };
      }

      const visit_count = data.length;
      const totalAmount = data.reduce((sum, item) => sum + Number(item.amount), 0);
      const average_ticket = Number((totalAmount / visit_count).toFixed(2));

      return {
        phone_number: phoneNumber,
        visit_count,
        average_ticket
      };
    } catch (err: unknown) {
      const error = err as Error;
      logger.error("Exception in SalesModel.getSalesAggregate", error);

      const isConnectionRefused = error.message && (
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      );

      if (isConnectionRefused) {
        throw new Error("DB_CONNECTION_FAILURE");
      }

      throw error;
    }
  }
}
