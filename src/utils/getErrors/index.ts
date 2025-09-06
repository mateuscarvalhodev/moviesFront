import { isAxiosError } from "axios";
import type { ApiErrorPayload } from "./types";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((i) => typeof i === "string");

const pickStringOrList = (v: unknown): string | undefined => {
  if (typeof v === "string") return v;
  if (isStringArray(v)) return v.join(", ");
  return undefined;
};

const pickErrors = (v: unknown): string | undefined => {
  const direct = pickStringOrList(v);
  if (direct) return direct;

  if (isRecord(v)) {
    const parts: string[] = [];
    for (const [key, val] of Object.entries(v)) {
      const msg = pickStringOrList(val);
      if (msg) parts.push(`${key}: ${msg}`);
    }
    if (parts.length) return parts.join(" | ");
  }
  return undefined;
};

export function getErrMsg(err: unknown): string {
  if (!isAxiosError(err)) {
    return err instanceof Error ? err.message : "Erro inesperado.";
  }

  const payload = err.response?.data as unknown;

  if (typeof payload === "string") return payload;

  if (isRecord(payload)) {
    const data = payload as Partial<ApiErrorPayload>;

    return (
      pickStringOrList(data.message) ??
      pickErrors(data.errors) ??
      pickStringOrList(data.detail) ??
      (typeof data.error === "string" ? data.error : undefined) ??
      err.message ??
      "Erro inesperado."
    );
  }

  // fallback
  return err.message ?? "Erro inesperado.";
}
