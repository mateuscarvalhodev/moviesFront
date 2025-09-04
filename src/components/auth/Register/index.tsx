import * as React from "react";
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

import {
  registerSchema,
  type RegisterValues,
  type RegisterProps,
} from "./types";

export const Register: React.FC<RegisterProps> = ({
  onSubmit,
  isLoading = false,
  defaultValues,
  error,
}) => {
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
  const canSubmit = form.formState.isValid && !isLoading && !submitting;

  async function handleSubmit(values: RegisterValues) {
    await onSubmit?.(values);
  }

  return (
    <div className="mx-auto w-[min(92vw,800px)] max-w-none rounded-2xl border border-white/10 bg-bg-elev/95 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
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

          {/* E-mail */}
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

          {/* Senha */}
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

          <div className="flex justify-end">
            <AppButton type="submit" disabled={!canSubmit} className="min-w-36">
              {isLoading || submitting ? "Cadastrando..." : "Cadastrar"}
            </AppButton>
          </div>

          {error ? (
            <p className="text-sm text-red-400/90 mt-1">{error}</p>
          ) : null}
        </form>
      </Form>
    </div>
  );
};
