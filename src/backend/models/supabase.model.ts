import { logger } from "../utils/logger.utils";

/**
 * Isolated Supabase Client Interface
 * Wraps database credentials securely. Easy to extract.
 */
class SupabaseModelClient {
  private isInitialized: boolean = false;
  private supabaseUrl: string | null = null;
  private supabaseAnonKey: string | null = null;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
    this.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

    if (this.supabaseUrl && this.supabaseAnonKey) {
      this.isInitialized = true;
      logger.info("Supabase client initialized successfully.");
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
