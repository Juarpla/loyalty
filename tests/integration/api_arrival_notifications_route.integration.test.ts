import { afterEach, describe, expect, it, vi } from "vitest";

import { ArrivalController } from "../../src/backend/controllers/arrival.controller";
import { logger } from "../../src/backend/utils/logger.utils";
import { GET } from "../../src/app/api/v1/arrivals/notifications/route";
import type { ArrivalControllerResponse } from "../../src/backend/types/models.type";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("api_arrival_notifications_route Integration Tests", () => {
  it("R1: exposes a callable GET route handler", () => {
    expect(GET).toEqual(expect.any(Function));
  });

  it("R2, R3, R4, R7: logs, delegates, and returns 200 with the controller success payload", async () => {
    const controllerPayload: ArrivalControllerResponse = {
      success: true,
      data: {
        notifications: [
          {
            clientId: "client-001",
            loginId: "login-001",
            phone_number: "+51999111222",
            name: "Ana",
            greetingText: "Hola Ana",
            whatsappUrl: "https://wa.me/51999111222?text=Hola",
            generatedAt: "2026-05-27T07:00:00.000Z",
            arrivedAt: "2026-05-27T06:55:00.000Z",
          },
        ],
        summary: {
          total: 1,
          named: 1,
          anonymous: 0,
          generatedAt: "2026-05-27T07:00:00.000Z",
          latestArrivalAt: "2026-05-27T06:55:00.000Z",
        },
      },
    };
    const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => {});
    const controllerSpy = vi
      .spyOn(ArrivalController, "getNotifications")
      .mockResolvedValueOnce(controllerPayload);

    const response = await GET();
    const data = await response.json();

    expect(infoSpy).toHaveBeenCalledWith(
      "GET /api/v1/arrivals/notifications API route invoked"
    );
    expect(controllerSpy).toHaveBeenCalledTimes(1);
    expect(controllerSpy).toHaveBeenCalledWith();
    expect(response.status).toBe(200);
    expect(data).toEqual(controllerPayload);
  });

  it("R5, R7: maps controller error payloads using the controller status", async () => {
    const controllerPayload: ArrivalControllerResponse = {
      success: false,
      status: 500,
      error: "DB_CONNECTION_FAILURE",
    };
    vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(ArrivalController, "getNotifications").mockResolvedValueOnce(
      controllerPayload
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual(controllerPayload);
  });

  it("R5, R7: defaults controller error payloads without status to HTTP 500", async () => {
    const controllerPayload = {
      success: false,
      error: "ARRIVAL_NOTIFICATIONS_FAILED",
    } as ArrivalControllerResponse;
    vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(ArrivalController, "getNotifications").mockResolvedValueOnce(
      controllerPayload
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual(controllerPayload);
  });

  it("R6, R7: logs unexpected controller exceptions and returns the stable fallback response", async () => {
    const error = new Error("UNEXPECTED_CRASH");
    const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
    vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(ArrivalController, "getNotifications").mockRejectedValueOnce(
      error
    );

    const response = await GET();
    const data = await response.json();

    expect(errorSpy).toHaveBeenCalledWith(
      "Unexpected error in GET /api/v1/arrivals/notifications",
      error
    );
    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  });
});
