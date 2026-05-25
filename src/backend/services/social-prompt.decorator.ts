import { TransactionRecord } from "../types/models.type";
import { TrafficService } from "./traffic.service";

const FLASH_SALE_INJECTION =
  "[Oferta Relámpago] This is a low-traffic day. Suggest creating a flash sale post to attract more customers today. Include urgency phrases and a limited-time offer angle.";

export function decorate(
  prompt: string,
  transactions: TransactionRecord[],
  date?: Date,
): string {
  if (transactions.length === 0) {
    return prompt;
  }

  const targetDate = date ?? new Date();

  if (TrafficService.isLowTrafficDay(targetDate, transactions)) {
    return `${prompt}\n${FLASH_SALE_INJECTION}`;
  }

  return prompt;
}
