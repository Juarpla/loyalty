import { describe, expect, it } from "vitest";

import { POST as login } from "../../src/app/api/v1/auth/login/route";
import { POST as register } from "../../src/app/api/v1/auth/register/route";
import {
  adminCompanyIdCookieName,
  authorizedAdminSession,
  createAdminCompanyId,
  demoAdminCompanyId,
  encodeRegisteredAdminCredentials,
  getAdminCompanyIdFromCookieHeader,
  registeredAdminCredentialsCookieName,
} from "../../src/backend/utils/admin-auth.utils";

function createJsonRequest(body: Record<string, string>, cookie?: string) {
  return new Request("http://localhost/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

function getCookieHeaderValue(response: Response, cookieName: string) {
  const cookieHeader = response.headers.get("set-cookie") ?? "";
  return cookieHeader.split(";")[0].startsWith(`${cookieName}=`)
    ? cookieHeader.split(";")[0]
    : "";
}

describe("auth registration gateway", () => {
  it("R1: stores a valid registered admin user in an HTTP-only cookie", async () => {
    const response = await register(
      createJsonRequest({ username: "manager", passcode: "2468" }),
    );
    const payload = await response.json();
    const credentialsCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(payload).toEqual({ success: true });
    expect(credentialsCookie).toContain(`${registeredAdminCredentialsCookieName}=`);
    expect(credentialsCookie).toContain("HttpOnly");
  });

  it("R2: rejects incomplete registration credentials", async () => {
    const response = await register(
      createJsonRequest({ username: "m", passcode: "12" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      success: false,
      error: "INVALID_REGISTRATION_INPUT",
    });
  });

  it("R3: authenticates registered admin credentials through Gateway Security", async () => {
    const registrationResponse = await register(
      createJsonRequest({ username: "owner", passcode: "8642" }),
    );
    const credentialsCookie = getCookieHeaderValue(
      registrationResponse,
      registeredAdminCredentialsCookieName,
    );

    const loginResponse = await login(
      createJsonRequest({ username: "owner", passcode: "8642" }, credentialsCookie),
    );
    const payload = await loginResponse.json();

    expect(loginResponse.status).toBe(200);
    expect(payload).toEqual({ success: true });
    expect(loginResponse.headers.get("set-cookie")).toContain(
      `admin_session=${authorizedAdminSession}`,
    );
    expect(loginResponse.headers.get("set-cookie")).toContain(
      `${adminCompanyIdCookieName}=${createAdminCompanyId("owner")}`,
    );
  });

  it("R4: preserves the offline simulation passcode login fallback with the demo portal ID", async () => {
    const response = await login(
      createJsonRequest({ username: "", passcode: "loyalty2026" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ success: true });
    expect(response.headers.get("set-cookie")).toContain(
      `admin_session=${authorizedAdminSession}`,
    );
    expect(response.headers.get("set-cookie")).toContain(
      `${adminCompanyIdCookieName}=${demoAdminCompanyId}`,
    );
  });

  it("R5: creates stable unique portal identifiers from registered usernames", () => {
    expect(createAdminCompanyId("owner")).toBe(createAdminCompanyId(" owner "));
    expect(createAdminCompanyId("owner")).not.toBe(createAdminCompanyId("manager"));
    expect(createAdminCompanyId("demo")).toBe(demoAdminCompanyId);
  });

  it("R6: resolves a unique portal ID from registered credentials when a legacy active session has no company cookie", () => {
    const registeredCredentials = encodeRegisteredAdminCredentials({
      username: "legacy-owner",
      passcode: "9753",
    });
    const cookieHeader = `admin_session=${authorizedAdminSession}; ${registeredAdminCredentialsCookieName}=${registeredCredentials}`;

    expect(getAdminCompanyIdFromCookieHeader(cookieHeader)).toBe(
      createAdminCompanyId("legacy-owner"),
    );
  });
});
