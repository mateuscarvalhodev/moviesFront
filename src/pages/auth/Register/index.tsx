import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppButton } from "@/components/Button";

import {
  registerSchema,
  type RegisterValues,
  type RegisterProps,
} from "./types";
import { registerUser } from "@/service/authApi";
import type { RegisterPayload } from "@/service/authApi/types";

export const Register: React.FC<RegisterProps> = ({
  onSubmit,
  isLoading = false,
  defaultValues,
  error,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      password: defaultValues?.password ?? "",
      confirmPassword: defaultValues?.confirmPassword ?? "",
    },
  });

  const submitting = form.formState.isSubmitting;
  const effectiveLoading = isLoading || loading;
  const canSubmit = form.formState.isValid && !effectiveLoading && !submitting;

  async function handleSubmit(values: RegisterValues) {
    if (onSubmit) {
      await onSubmit(values);
      return;
    }
    setErrorMsg(undefined);
    setLoading(true);
    try {
      const payload: RegisterPayload = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      await registerUser(payload);
      navigate("/auth/login");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (err as Error)?.message ??
        "Erro ao cadastrar.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-[min(92vw,600px)] max-w-none rounded-2xl border border-white/10 bg-bg-elev/95 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mauve-11">Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Digite seu nome"
                    autoComplete="name"
                    className="bg-bg text-fg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mauve-11">E-mail</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    className="bg-bg text-fg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mauve-11">Senha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Digite sua senha"
                    autoComplete="new-password"
                    className="bg-bg text-fg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mauve-11">
                  Confirmação de senha
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Digite sua senha novamente"
                    autoComplete="new-password"
                    className="bg-bg text-fg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <div>
              <p className="mt-6 text-center text-sm">
                <span className="text-muted">Já possui conta? </span>
                <Link
                  to="/auth/login"
                  className="text-brand hover:text-brand-cta font-medium"
                >
                  Logar
                </Link>
              </p>
            </div>
            <div>
              <AppButton
                type="submit"
                disabled={!canSubmit}
                className="min-w-36"
              >
                {effectiveLoading || submitting
                  ? "Cadastrando..."
                  : "Cadastrar"}
              </AppButton>
            </div>
          </div>

          {(errorMsg || error) && (
            <p className="text-sm text-red-400/90 mt-1">{errorMsg ?? error}</p>
          )}
        </form>
      </Form>
    </div>
  );
};
