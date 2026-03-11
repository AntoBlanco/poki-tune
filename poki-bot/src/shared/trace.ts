import { randomUUID } from "crypto";

export function createTraceId(): string {
  return randomUUID();
}
