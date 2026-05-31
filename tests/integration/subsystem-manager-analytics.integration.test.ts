import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import AdminDashboardPage, { metadata } from "../../src/app/admin/dashboard/page";
import { proxy } from "../../src/proxy";

const managerDashboardRouteUrl = "http://localhost/admin/dashboard";

function createManagerAnalyticsGatewayRequest(cookie?: string) {
  return new NextRequest(managerDashboardRouteUrl, {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("subsystem_manager_analytics", () => {
  it("R1: redirects unauthenticated manager analytics requests to the login gateway with callbackUrl", () => {
    const response = proxy(createManagerAnalyticsGatewayRequest());

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?callbackUrl=%2Fadmin%2Fdashboard",
    );
  });

  it("R2: allows manager analytics requests with the valid administrative session cookie", () => {
    const response = proxy(
      createManagerAnalyticsGatewayRequest(
        "admin_session=authorized_admin_session",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("R3: preserves the manager dashboard page module behind the gateway", () => {
    expect(typeof AdminDashboardPage).toBe("function");
    expect(metadata).toMatchObject({
      title: "Manager Dashboard | Loyalty",
      description: "View sales traffic and peak hours analytics",
    });
  });
});
