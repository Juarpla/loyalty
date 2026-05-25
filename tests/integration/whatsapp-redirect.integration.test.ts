// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createElement } from "react";
import { WhatsAppShareButton } from "../../src/components/ui/whatsapp-share-button.component";

const WA_URL = "https://wa.me/525551234567?text=Hello%20world";
const TEST_PHONE = "+52 (555) 123-4567";
const TEST_MESSAGE = "Hello world";

vi.mock("../../src/backend/utils/whatsapp.utils", () => ({
  encodeWhatsAppUrl: vi.fn(() => WA_URL),
}));

import { encodeWhatsAppUrl } from "../../src/backend/utils/whatsapp.utils";

describe("WhatsAppShareButton Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(encodeWhatsAppUrl).mockReturnValue(WA_URL);
    vi.stubGlobal("open", vi.fn());
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("R5: calls encodeWhatsAppUrl with correct args and window.open with correct URL", () => {
    const mockOpen = vi.fn(() => ({}));
    vi.stubGlobal("open", mockOpen);

    render(createElement(WhatsAppShareButton, { phone: TEST_PHONE, message: TEST_MESSAGE }));
    fireEvent.click(screen.getByRole("button"));

    expect(encodeWhatsAppUrl).toHaveBeenCalledWith(TEST_PHONE, TEST_MESSAGE);
    expect(mockOpen).toHaveBeenCalledWith(WA_URL, "_blank");
  });

  it("R6: assigns window.location.href when window.open returns null", () => {
    vi.stubGlobal("open", vi.fn(() => null));

    render(createElement(WhatsAppShareButton, { phone: TEST_PHONE, message: TEST_MESSAGE }));
    fireEvent.click(screen.getByRole("button"));

    expect(window.location.href).toBe(WA_URL);
  });

  it("R7: assigns window.location.href when window.open throws", () => {
    vi.stubGlobal("open", vi.fn(() => { throw new Error("Blocked"); }));

    render(createElement(WhatsAppShareButton, { phone: TEST_PHONE, message: TEST_MESSAGE }));
    fireEvent.click(screen.getByRole("button"));

    expect(window.location.href).toBe(WA_URL);
  });

  it("R8: button has aria-label set to Share on WhatsApp", () => {
    render(createElement(WhatsAppShareButton, { phone: TEST_PHONE, message: TEST_MESSAGE }));

    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-label")).toBe("Share on WhatsApp");
  });
});
