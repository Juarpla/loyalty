"use client";

import { encodeWhatsAppUrl } from "@/backend/utils/whatsapp.utils";

interface WhatsAppShareButtonProps {
  phone: string;
  message: string;
  className?: string;
}

export function WhatsAppShareButton({
  phone,
  message,
  className = "",
}: WhatsAppShareButtonProps) {
  const handleClick = () => {
    const url = encodeWhatsAppUrl(phone, message);
    try {
      const opened = window.open(url, "_blank");
      if (opened === null) {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Share on WhatsApp"
      className={`inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${className}`}
    >
      Share on WhatsApp
    </button>
  );
}
