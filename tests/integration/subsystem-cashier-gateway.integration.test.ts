import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import CashierPage, { metadata } from "../../src/app/admin/cash/page";
import { middleware } from "../../src/middleware";

const cashierRouteUrl = "http://localhost/admin/cash";

function createCashierGatewayRequest(cookie?: string) {
  return new NextRequest(cashierRouteUrl, {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("subsystem_cashier_gateway", () => {
  it("R1: redirects unauthenticated cashier requests to the login gateway with callbackUrl", () => {
    const response = middleware(createCashierGatewayRequest());

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?callbackUrl=%2Fadmin%2Fcash",
    );
  });

  it("R2: allows cashier requests with the valid administrative session cookie", () => {
    const response = middleware(
      createCashierGatewayRequest("admin_session=authorized_admin_session"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("R3: preserves the cashier ledger page module behind the gateway", () => {
    expect(typeof CashierPage).toBe("function");
    expect(metadata).toMatchObject({
      title: "Cashier Dashboard | Loyalty",
      description: "Register customer sales transactions",
    });
  });
});
