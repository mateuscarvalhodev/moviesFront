import { z } from "zod";

/** username OU e-mail válido */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Informe seu nome ou e-mail")
    .max(120, "Muito longo")
    .refine(
      (v) => !v.includes("@") || z.string().email().safeParse(v).success,
      "E-mail inválido"
    ),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export type LoginProps = {
  onSubmit?: (values: LoginValues) => Promise<void> | void;
  isLoading?: boolean;
  forgotHref?: string;
  defaultValues?: Partial<LoginValues>;
  error?: string | null;
};
