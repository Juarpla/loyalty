import { logger } from "../utils/logger.utils";

/**
 * Isolated WhatsApp Messaging Service
 */
export class WhatsappService {
  /**
   * Generates a wa.me URL for immediate customer chat with prefilled custom text message
   */
  static generateClickToChatLink(phone: string, prefilledText: string): string {
    logger.info("WhatsappService.generateClickToChatLink invoked", { phone });

    // Clean phone number (remove spaces, symbols, leading plus if needed depending on WhatsApp specs)
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    
    // URL encode the message content
    const encodedText = encodeURIComponent(prefilledText);

    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
}
