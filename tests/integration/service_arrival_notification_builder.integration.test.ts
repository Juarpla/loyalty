import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/backend/utils/whatsapp.utils", () => ({
  encodeWhatsAppUrl: vi.fn((phone: string, text: string) => {
    return `mock-wa-url:${phone}:${text}`;
  }),
}));

import { ArrivalService } from "../../src/backend/services/arrival.service";
import { encodeWhatsAppUrl } from "../../src/backend/utils/whatsapp.utils";
import type {
  ArrivalNotification,
  ArrivalNotificationInput,
} from "../../src/backend/types/models.type";

describe("service_arrival_notification_builder Integration Tests", () => {
  beforeEach(() => {
    vi.mocked(encodeWhatsAppUrl).mockClear();
  });

  it("R1, R2, R3, R4, R5, R8: builds a personalized arrival notification with WhatsApp URL", () => {
    const notification = ArrivalService.buildNotification({
      phone_number: "+51 999 888 777",
      name: "Maria",
      businessName: "Cafe Central",
    });

    expect(notification).toMatchObject({
      phone_number: "+51 999 888 777",
      name: "Maria",
      greetingText:
        "Hola Maria, gracias por visitarnos en Cafe Central. Estamos felices de verte de nuevo.",
      whatsappUrl:
        "mock-wa-url:+51 999 888 777:Hola Maria, gracias por visitarnos en Cafe Central. Estamos felices de verte de nuevo.",
    });
    expect(Date.parse(notification.generatedAt)).not.toBeNaN();
    expect(encodeWhatsAppUrl).toHaveBeenCalledWith(
      "+51 999 888 777",
      notification.greetingText,
    );
  });

  it("R2, R3, R4, R8: builds a generic greeting with the default business label", () => {
    const notification = ArrivalService.buildNotification({
      phone_number: "51999888777",
    });

    expect(notification.name).toBe("");
    expect(notification.greetingText).toBe(
      "Hola, gracias por visitarnos en nuestro negocio. Estamos felices de verte.",
    );
    expect(encodeWhatsAppUrl).toHaveBeenCalledWith(
      "51999888777",
      notification.greetingText,
    );
  });

  it("R3, R4, R6, R8: trims name and business name before generating output", () => {
    const notification = ArrivalService.buildNotification({
      phone_number: "51911111111",
      name: "  Luis  ",
      businessName: "  Panaderia Sol  ",
    });

    expect(notification.name).toBe("Luis");
    expect(notification.greetingText).toBe(
      "Hola Luis, gracias por visitarnos en Panaderia Sol. Estamos felices de verte de nuevo.",
    );
    expect(encodeWhatsAppUrl).toHaveBeenCalledWith(
      "51911111111",
      notification.greetingText,
    );
  });

  it("R3, R4, R6, R8: treats blank name and business name as fallback values", () => {
    const notification = ArrivalService.buildNotification({
      phone_number: "51922222222",
      name: "   ",
      businessName: "   ",
    });

    expect(notification.name).toBe("");
    expect(notification.greetingText).toBe(
      "Hola, gracias por visitarnos en nuestro negocio. Estamos felices de verte.",
    );
  });

  it("R7: exposes reusable arrival notification TypeScript interfaces", () => {
    const input: ArrivalNotificationInput = {
      phone_number: "51933333333",
      name: "Ana",
    };
    const notification: ArrivalNotification =
      ArrivalService.buildNotification(input);

    expect(notification.phone_number).toBe(input.phone_number);
    expect(notification.generatedAt).toEqual(expect.any(String));
  });
});
