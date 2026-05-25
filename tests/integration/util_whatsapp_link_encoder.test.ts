import { describe, it, expect } from "vitest";
import { encodeWhatsAppUrl } from "../../src/backend/utils/whatsapp.utils";

describe("encodeWhatsAppUrl", () => {
  describe("R1 + R2: Basic URL construction with valid phone and text", () => {
    it("SHALL return a correctly formatted wa.me URL", () => {
      const result = encodeWhatsAppUrl("5215551234567", "Hola");
      expect(result).toBe("https://wa.me/5215551234567?text=Hola");
    });
  });

  describe("R3: Blank spaces encoded as %20", () => {
    it("SHALL encode spaces in text as %20", () => {
      const result = encodeWhatsAppUrl("5215551234567", "Hola mundo");
      expect(result).toBe("https://wa.me/5215551234567?text=Hola%20mundo");
    });
  });

  describe("R4: Non-digit characters stripped from phone", () => {
    it("SHALL strip +, -, spaces, and parentheses from phone", () => {
      const result = encodeWhatsAppUrl("+52 (555) 123-4567", "Hola");
      expect(result).toBe("https://wa.me/525551234567?text=Hola");
    });
  });

  describe("R5: Special characters in text", () => {
    it("SHALL percent-encode special URL characters in text", () => {
      const result = encodeWhatsAppUrl("5215551234567", "¿Cómo estás?");
      expect(result).toBe("https://wa.me/5215551234567?text=%C2%BFC%C3%B3mo%20est%C3%A1s%3F");
    });
  });

  describe("R6: Empty phone after sanitization", () => {
    it("SHALL return URL with empty phone segment when no digits remain", () => {
      const result = encodeWhatsAppUrl("abc", "Hola");
      expect(result).toBe("https://wa.me/?text=Hola");
    });

    it("SHALL return URL with empty phone segment when phone is empty string", () => {
      const result = encodeWhatsAppUrl("", "Hola");
      expect(result).toBe("https://wa.me/?text=Hola");
    });
  });

  describe("R7: Empty text message", () => {
    it("SHALL return URL with empty text query parameter", () => {
      const result = encodeWhatsAppUrl("5215551234567", "");
      expect(result).toBe("https://wa.me/5215551234567?text=");
    });
  });
});
