import { createClient, SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";
import { Database } from "../types/database.type";
import { logger } from "../utils/logger.utils";

// Ensure global WebSocket is available in older Node.js versions
if (typeof global.WebSocket === "undefined") {
  global.WebSocket = ws as unknown as typeof global.WebSocket;
}

/**
 * Isolated Supabase Client Interface
 * Wraps database credentials securely. Easy to extract.
 */
class SupabaseModelClient {
  private isInitialized: boolean = false;
  private supabaseUrl: string | null = null;
  private supabaseAnonKey: string | null = null;
  private client: SupabaseClient<Database> | null = null;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
    this.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        this.client = createClient<Database>(this.supabaseUrl, this.supabaseAnonKey, {
          auth: {
            persistSession: false,
          },
        });
        this.isInitialized = true;
        logger.info("Supabase client initialized successfully.");
      } catch (err) {
        logger.error("Failed to initialize Supabase client", err);
        this.isInitialized = false;
      }
    } else {
      logger.warn("Supabase credentials missing. Running database in simulation/offline mode.");
    }
  }

  /**
   * Safe getter for Supabase status
   */
  public getStatus() {
    return {
      initialized: this.isInitialized,
      mode: this.isInitialized ? "production" : "offline_simulation"
    };
  }

  /**
   * Safe getter for Supabase Client
   */
  public getClient(): SupabaseClient<Database> {
    if (!this.isInitialized || !this.client) {
      throw new Error("Supabase client is not initialized.");
    }
    return this.client;
  }

  /**
   * Simulated execution helper for development if DB is not set up
   */
  public async executeQuery<T>(queryName: string, mockData: T): Promise<T> {
    logger.info(`Database Executing Query: [${queryName}]`);
    
    // Simulate minor delay representing network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 80));
    
    return mockData;
  }
}

export const supabaseModel = new SupabaseModelClient();
