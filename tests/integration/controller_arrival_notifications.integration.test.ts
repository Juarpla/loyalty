import { describe, it, expect, vi, afterEach } from "vitest";

import { ArrivalController } from "../../src/backend/controllers/arrival.controller";
import { ClientModel } from "../../src/backend/models/client.model";
import { ArrivalService } from "../../src/backend/services/arrival.service";
import { logger } from "../../src/backend/utils/logger.utils";
import type {
  ArrivalNotificationInput,
  ArrivalNotification,
  PortalArrivalRecord,
} from "../../src/backend/types/models.type";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("controller_arrival_notifications Integration Tests", () => {
  it("R1, R2, R3, R4, R5, R6: returns enriched arrival notifications and summary metrics", async () => {
    const arrivals: PortalArrivalRecord[] = [
      {
        clientId: "cli-001",
        loginId: "log-001",
        phone_number: "+51999111222",
        name: "Ana",
        arrivedAt: "2026-05-27T06:00:00.000Z",
      },
      {
        clientId: "cli-002",
        loginId: "log-002",
        phone_number: "+51999333444",
        name: null,
        arrivedAt: "2026-05-27T05:55:00.000Z",
      },
    ];
    const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(ClientModel, "getRecentPortalArrivals").mockResolvedValue(arrivals);
    const serviceSpy = vi
      .spyOn(ArrivalService, "buildNotification")
      .mockImplementation((input: ArrivalNotificationInput): ArrivalNotification => ({
        phone_number: input.phone_number,
        name: input.name?.trim() ?? "",
        greetingText: `Hola ${input.name?.trim() || "cliente"}`,
        whatsappUrl: `https://wa.me/${input.phone_number.replace(/\D/g, "")}?text=test`,
        generatedAt: "2026-05-27T06:01:00.000Z",
      }));

    const response = await ArrivalController.getNotifications();

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error("Expected successful arrival notifications response");
    }

    expect(infoSpy).toHaveBeenCalledWith("ArrivalController.getNotifications started");
    expect(ClientModel.getRecentPortalArrivals).toHaveBeenCalledTimes(1);
    expect(serviceSpy).toHaveBeenNthCalledWith(1, {
      phone_number: "+51999111222",
      name: "Ana",
    });
    expect(serviceSpy).toHaveBeenNthCalledWith(2, {
      phone_number: "+51999333444",
    });
    expect(response.data.notifications).toEqual([
      {
        clientId: "cli-001",
        loginId: "log-001",
        phone_number: "+51999111222",
        name: "Ana",
        greetingText: "Hola Ana",
        whatsappUrl: "https://wa.me/51999111222?text=test",
        generatedAt: "2026-05-27T06:01:00.000Z",
        arrivedAt: "2026-05-27T06:00:00.000Z",
      },
      {
        clientId: "cli-002",
        loginId: "log-002",
        phone_number: "+51999333444",
        name: "",
        greetingText: "Hola cliente",
        whatsappUrl: "https://wa.me/51999333444?text=test",
        generatedAt: "2026-05-27T06:01:00.000Z",
        arrivedAt: "2026-05-27T05:55:00.000Z",
      },
    ]);
    expect(response.data.summary).toMatchObject({
      total: 2,
      named: 1,
      anonymous: 1,
      latestArrivalAt: "2026-05-27T06:00:00.000Z",
    });
    expect(Date.parse(response.data.summary.generatedAt)).not.toBeNaN();
  });

  it("R7: returns an empty success envelope when no recent portal arrivals exist", async () => {
    vi.spyOn(ClientModel, "getRecentPortalArrivals").mockResolvedValue([]);
    vi.spyOn(logger, "info").mockImplementation(() => {});

    const response = await ArrivalController.getNotifications();

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error("Expected empty arrival notifications response");
    }

    expect(response.data.notifications).toEqual([]);
    expect(response.data.summary).toMatchObject({
      total: 0,
      named: 0,
      anonymous: 0,
      latestArrivalAt: null,
    });
    expect(Date.parse(response.data.summary.generatedAt)).not.toBeNaN();
  });

  it("R8, R9: maps DB_CONNECTION_FAILURE errors to the stable error envelope", async () => {
    const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
    vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(ClientModel, "getRecentPortalArrivals").mockRejectedValue(
      new Error("DB_CONNECTION_FAILURE")
    );

    const response = await ArrivalController.getNotifications();

    expect(response).toEqual({
      success: false,
      status: 500,
      error: "DB_CONNECTION_FAILURE",
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "ArrivalController.getNotifications failed",
      expect.any(Error)
    );
  });

  it("R9: maps generic model errors to a logged 500 response", async () => {
    const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
    vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(ClientModel, "getRecentPortalArrivals").mockRejectedValue(
      new Error("DB_QUERY_ERROR")
    );

    const response = await ArrivalController.getNotifications();

    expect(response).toEqual({
      success: false,
      status: 500,
      error: "DB_QUERY_ERROR",
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "ArrivalController.getNotifications failed",
      expect.any(Error)
    );
  });
});
