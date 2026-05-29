import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { createClient } from "@supabase/supabase-js";
import { CompanyModel } from "../../src/backend/models/company.model";
import { supabaseModel } from "../../src/backend/models/supabase.model";

if (typeof global.WebSocket === "undefined") {
  global.WebSocket = ws as unknown as typeof global.WebSocket;
}

beforeAll(() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
  }
});

interface SupabaseModelClientInternals {
  isInitialized: boolean;
  client: unknown;
}

type LocalSupabaseClient = ReturnType<typeof createClient>;

function createLocalSupabaseClient(): LocalSupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

async function createCompany(namePrefix: string): Promise<string> {
  const client = createLocalSupabaseClient();
  const { data, error } = await client
    .from("companies")
    .insert({ name: `${namePrefix} ${Date.now()} ${Math.random()}` })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

describe("model_company_wifi_settings Integration Tests", () => {
  let originalIsInitialized: boolean;
  let originalClient: unknown;

  beforeAll(() => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    originalIsInitialized = internals.isInitialized;
    originalClient = internals.client;
    internals.isInitialized = true;
    internals.client = createLocalSupabaseClient();
  });

  afterAll(() => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = originalIsInitialized;
    internals.client = originalClient;
  });

  it("R1, R7: should return persisted company WiFi settings for a valid company ID", async () => {
    const companyId = await createCompany("Read Company");

    await CompanyModel.upsertWifiSettings({
      company_id: companyId,
      ssid: "Cafe Guest",
      wifi_password: "strong-password-123",
      welcome_title: "Welcome Cafe",
      welcome_message: "Sign in for loyalty rewards",
      brand_color: "#123456",
    });

    const settings = await CompanyModel.getWifiSettings(companyId);

    expect(settings).toEqual({
      company_id: companyId,
      ssid: "Cafe Guest",
      wifi_password: "strong-password-123",
      welcome_title: "Welcome Cafe",
      welcome_message: "Sign in for loyalty rewards",
      brand_color: "#123456",
    });
  });

  it("R2, R7: should throw VALIDATION_ERROR when reading with an empty company ID", async () => {
    await expect(CompanyModel.getWifiSettings("")).rejects.toThrow("VALIDATION_ERROR");
    await expect(CompanyModel.getWifiSettings("   ")).rejects.toThrow("VALIDATION_ERROR");
  });

  it("R3, R7: should return null when a company has no WiFi settings", async () => {
    const companyId = await createCompany("Empty Settings Company");

    await expect(CompanyModel.getWifiSettings(companyId)).resolves.toBeNull();
  });

  it("R4, R7: should upsert company WiFi settings using company_id as conflict target", async () => {
    const companyId = await createCompany("Upsert Company");

    const createdSettings = await CompanyModel.upsertWifiSettings({
      company_id: companyId,
      ssid: "Original SSID",
      wifi_password: "original-password",
    });

    expect(createdSettings).toEqual({
      company_id: companyId,
      ssid: "Original SSID",
      wifi_password: "original-password",
      welcome_title: "Welcome to our WiFi",
      welcome_message: "Please sign in to connect",
      brand_color: "#000000",
    });

    const updatedSettings = await CompanyModel.upsertWifiSettings({
      company_id: companyId,
      ssid: "Updated SSID",
      wifi_password: "updated-password",
      welcome_title: "Updated Welcome",
      welcome_message: "Updated message",
      brand_color: "#abcdef",
    });

    expect(updatedSettings).toEqual({
      company_id: companyId,
      ssid: "Updated SSID",
      wifi_password: "updated-password",
      welcome_title: "Updated Welcome",
      welcome_message: "Updated message",
      brand_color: "#abcdef",
    });

    const rereadSettings = await CompanyModel.getWifiSettings(companyId);
    expect(rereadSettings).toEqual(updatedSettings);
  });

  it("R5, R7: should throw VALIDATION_ERROR when upsert input is missing required fields", async () => {
    await expect(
      CompanyModel.upsertWifiSettings({
        company_id: "",
        ssid: "Guest",
        wifi_password: "password",
      })
    ).rejects.toThrow("VALIDATION_ERROR");

    await expect(
      CompanyModel.upsertWifiSettings({
        company_id: "00000000-0000-0000-0000-000000000001",
        ssid: "",
        wifi_password: "password",
      })
    ).rejects.toThrow("VALIDATION_ERROR");

    await expect(
      CompanyModel.upsertWifiSettings({
        company_id: "00000000-0000-0000-0000-000000000001",
        ssid: "Guest",
        wifi_password: "",
      })
    ).rejects.toThrow("VALIDATION_ERROR");
  });

  it("R6, R7: should throw DB_CONNECTION_FAILURE when read or upsert cannot reach the database", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    internals.client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: null,
              error: { message: "fetch failed", code: "" },
            }),
          }),
        }),
        upsert: () => ({
          select: () => ({
            single: async () => ({
              data: null,
              error: { message: "fetch failed", code: "" },
            }),
          }),
        }),
      }),
    };

    await expect(
      CompanyModel.getWifiSettings("00000000-0000-0000-0000-000000000001")
    ).rejects.toThrow("DB_CONNECTION_FAILURE");

    await expect(
      CompanyModel.upsertWifiSettings({
        company_id: "00000000-0000-0000-0000-000000000001",
        ssid: "Guest",
        wifi_password: "password",
      })
    ).rejects.toThrow("DB_CONNECTION_FAILURE");

    internals.client = createLocalSupabaseClient();
  });
});
