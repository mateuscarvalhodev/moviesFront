import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .max(120, "Muito longo")
    .email("E-mail inválido"),
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
