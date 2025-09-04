import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export type RegisterProps = {
  onSubmit?: (values: RegisterValues) => Promise<void> | void;
  isLoading?: boolean;
  defaultValues?: Partial<RegisterValues>;
  error?: string | null;
};
