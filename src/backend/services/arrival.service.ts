import { encodeWhatsAppUrl } from "../utils/whatsapp.utils";
import type {
  ArrivalNotification,
  ArrivalNotificationInput,
} from "../types/models.type";

const DEFAULT_BUSINESS_NAME = "nuestro negocio";

export class ArrivalService {
  static buildNotification(
    input: ArrivalNotificationInput,
  ): ArrivalNotification {
    const name = input.name?.trim() ?? "";
    const businessName = input.businessName?.trim() || DEFAULT_BUSINESS_NAME;
    const greetingText = buildGreetingText(name, businessName);

    return {
      phone_number: input.phone_number,
      name,
      greetingText,
      whatsappUrl: encodeWhatsAppUrl(input.phone_number, greetingText),
      generatedAt: new Date().toISOString(),
    };
  }
}

function buildGreetingText(name: string, businessName: string): string {
  if (name.length > 0) {
    return `Hola ${name}, gracias por visitarnos en ${businessName}. Estamos felices de verte de nuevo.`;
  }

  return `Hola, gracias por visitarnos en ${businessName}. Estamos felices de verte.`;
}
