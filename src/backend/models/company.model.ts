import { supabaseModel } from "./supabase.model";
import {
  CompanyWifiSettings,
  UpsertCompanyWifiSettingsInput,
} from "../types/company.type";
import { logger } from "../utils/logger.utils";

type CompanyWifiSettingsRow = {
  company_id: string;
  ssid: string;
  wifi_password: string;
  welcome_title: string;
  welcome_message: string;
  brand_color: string;
};

const CONNECTION_FAILURE_MARKERS = [
  "fetch failed",
  "ECONNREFUSED",
  "Failed to fetch",
  "NetworkError",
  "Supabase client is not initialized",
];

function isBlank(value: string | undefined): boolean {
  return !value || value.trim() === "";
}

function mapCompanyWifiSettingsRow(row: CompanyWifiSettingsRow): CompanyWifiSettings {
  return {
    company_id: row.company_id,
    ssid: row.ssid,
    wifi_password: row.wifi_password,
    welcome_title: row.welcome_title,
    welcome_message: row.welcome_message,
    brand_color: row.brand_color,
  };
}

function normalizeCompanyModelError(error: unknown): Error {
  const typedError = error as Error;
  const errorMessage = typedError.message ?? "";

  if (errorMessage === "VALIDATION_ERROR" || errorMessage === "DB_CONNECTION_FAILURE") {
    return typedError;
  }

  if (CONNECTION_FAILURE_MARKERS.some((marker) => errorMessage.includes(marker))) {
    return new Error("DB_CONNECTION_FAILURE");
  }

  const errorCode = (error as Record<string, unknown>)?.code;
  return new Error(typeof errorCode === "string" ? errorCode : "DB_QUERY_ERROR");
}

function buildUpsertPayload(input: UpsertCompanyWifiSettingsInput) {
  return {
    company_id: input.company_id,
    ssid: input.ssid,
    wifi_password: input.wifi_password,
    ...(input.welcome_title !== undefined ? { welcome_title: input.welcome_title } : {}),
    ...(input.welcome_message !== undefined ? { welcome_message: input.welcome_message } : {}),
    ...(input.brand_color !== undefined ? { brand_color: input.brand_color } : {}),
  };
}

export class CompanyModel {
  static async getWifiSettings(companyId: string): Promise<CompanyWifiSettings | null> {
    logger.info("CompanyModel.getWifiSettings invoked", { companyId });

    if (isBlank(companyId)) {
      throw new Error("VALIDATION_ERROR");
    }

    const status = supabaseModel.getStatus();

    if (status.mode === "offline_simulation") {
      const mockSettings: CompanyWifiSettings | null = companyId.includes("without-settings")
        ? null
        : {
          company_id: companyId,
          ssid: "Loyalty Guest WiFi",
          wifi_password: "guest-password",
          welcome_title: "Welcome to our WiFi",
          welcome_message: "Please sign in to connect",
          brand_color: "#000000",
        };

      return supabaseModel.executeQuery<CompanyWifiSettings | null>(
        "getCompanyWifiSettings",
        mockSettings
      );
    }

    try {
      const client = supabaseModel.getClient();
      const { data, error } = await client
        .from("company_wifi_settings")
        .select("company_id, ssid, wifi_password, welcome_title, welcome_message, brand_color")
        .eq("company_id", companyId)
        .maybeSingle();

      if (error) {
        logger.error("Database error in CompanyModel.getWifiSettings", error);
        throw error;
      }

      if (!data) {
        return null;
      }

      return mapCompanyWifiSettingsRow(data);
    } catch (err: unknown) {
      const normalizedError = normalizeCompanyModelError(err);
      logger.error("Exception in CompanyModel.getWifiSettings", normalizedError);
      throw normalizedError;
    }
  }

  static async upsertWifiSettings(
    input: UpsertCompanyWifiSettingsInput
  ): Promise<CompanyWifiSettings> {
    logger.info("CompanyModel.upsertWifiSettings invoked", {
      company_id: input.company_id,
      ssid: input.ssid,
    });

    if (isBlank(input.company_id) || isBlank(input.ssid) || isBlank(input.wifi_password)) {
      throw new Error("VALIDATION_ERROR");
    }

    const status = supabaseModel.getStatus();
    const upsertPayload = buildUpsertPayload(input);

    if (status.mode === "offline_simulation") {
      const mockSettings: CompanyWifiSettings = {
        company_id: input.company_id,
        ssid: input.ssid,
        wifi_password: input.wifi_password,
        welcome_title: input.welcome_title ?? "Welcome to our WiFi",
        welcome_message: input.welcome_message ?? "Please sign in to connect",
        brand_color: input.brand_color ?? "#000000",
      };

      return supabaseModel.executeQuery<CompanyWifiSettings>(
        "upsertCompanyWifiSettings",
        mockSettings
      );
    }

    try {
      const client = supabaseModel.getClient();
      const { data, error } = await client
        .from("company_wifi_settings")
        .upsert(upsertPayload, { onConflict: "company_id" })
        .select("company_id, ssid, wifi_password, welcome_title, welcome_message, brand_color")
        .single();

      if (error) {
        logger.error("Database error in CompanyModel.upsertWifiSettings", error);
        throw error;
      }

      return mapCompanyWifiSettingsRow(data);
    } catch (err: unknown) {
      const normalizedError = normalizeCompanyModelError(err);
      logger.error("Exception in CompanyModel.upsertWifiSettings", normalizedError);
      throw normalizedError;
    }
  }
}
