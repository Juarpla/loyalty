import { supabaseModel } from "./supabase.model";
import { DatabaseClient, TrafficRecord } from "../types/models.type";
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
}
