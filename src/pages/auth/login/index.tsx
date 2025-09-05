import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
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
import { loginSchema, type LoginValues, type LoginProps } from "./types";
import { loginUser } from "@/service/authApi";
import type { LoginPayload, AuthResponse } from "@/service/authApi/types";

export const Login = ({
  onSubmit,
  isLoading = false,
  forgotHref = "#",
  defaultValues,
  error,
}: LoginProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: defaultValues?.email ?? "",
      password: defaultValues?.password ?? "",
    },
  });

  const submitting = form.formState.isSubmitting;
  const effectiveLoading = isLoading || loading;
  const canSubmit = form.formState.isValid && !effectiveLoading && !submitting;

  async function handleSubmit(values: LoginValues) {
    const trimmed: LoginValues = {
      ...values,
      email: values.email.trim(),
    };

    if (onSubmit) {
      await onSubmit(trimmed);
      return;
    }

    setErrorMsg(undefined);
    setLoading(true);
    try {
      const payload: LoginPayload = {
        email: trimmed.email,
        password: trimmed.password,
      };
      const data: AuthResponse = await loginUser(payload);

      try {
        sessionStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken)
          sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      } catch {
        setErrorMsg("Não foi possível salvar a sessão do usuário.");
      }

      navigate("/movies");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (err as Error)?.message ??
        "Erro ao entrar.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-[min(80vw,600px)] max-w-none rounded-2xl border border-white/10 bg-bg-elev/95 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mauve-11">E-mail</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="email"
                    placeholder="Digite seu e-mail"
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
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    className="bg-bg text-fg h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 flex items-center justify-between gap-4">
            {forgotHref.startsWith("/") ? (
              <Link
                to={forgotHref}
                className="text-sm text-brand hover:text-brand-cta underline-offset-4 hover:underline"
              >
                Esqueci minha senha
              </Link>
            ) : (
              <a
                href={forgotHref}
                className="text-sm text-brand hover:text-brand-cta underline-offset-4 hover:underline"
              >
                Esqueci minha senha
              </a>
            )}

            <AppButton type="submit" disabled={!canSubmit} className="min-w-32">
              {effectiveLoading || submitting ? "Entrando..." : "Entrar"}
            </AppButton>
          </div>

          {(errorMsg || error) && (
            <p className="text-sm text-red-400/90 mt-1">{errorMsg ?? error}</p>
          )}

          <p className="mt-6 text-center text-sm">
            <span className="text-muted">Ainda não possui conta? </span>
            <Link
              to="/auth/register"
              className="text-brand hover:text-brand-cta font-medium"
            >
              Registrar
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};
