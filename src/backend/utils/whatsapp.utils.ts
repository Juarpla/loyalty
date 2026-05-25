export function encodeWhatsAppUrl(phone: string, text: string): string {
  const cleanedPhone = phone.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
}
