export type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
  errors?: string | string[] | Record<string, string | string[]>;
  detail?: string | string[];
};
