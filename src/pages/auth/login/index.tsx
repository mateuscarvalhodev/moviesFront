import { useForm } from "react-hook-form";
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
import { Link } from "react-router";

export const Login = ({
  onSubmit,
  isLoading = false,
  forgotHref = "#",
  defaultValues,
  error,
}: LoginProps) => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      identifier: defaultValues?.identifier ?? "",
      password: defaultValues?.password ?? "",
    },
  });

  const submitting = form.formState.isSubmitting;
  const canSubmit = form.formState.isValid && !isLoading && !submitting;

  async function handleSubmit(values: LoginValues) {
    await onSubmit?.({ ...values, identifier: values.identifier.trim() });
  }

  return (
    <div className="mx-auto w-[min(80vw,600px)] max-w-none rounded-2xl border border-white/10 bg-bg-elev/95 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mauve-11">Nome/E-mail</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="username"
                    placeholder="Digite seu nome/E-mail"
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
              {isLoading || submitting ? "Entrando..." : "Entrar"}
            </AppButton>
          </div>

          {error ? (
            <p className="text-sm text-red-400/90 mt-1">{error}</p>
          ) : null}

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
