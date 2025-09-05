import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEvent } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppButton } from "@/components/Button";

const fileSchema = z
  .instanceof(File)
  .refine(
    (f) => ["image/jpeg", "image/png"].includes(f.type),
    "Apenas JPG ou PNG"
  )
  .refine((f) => f.size <= 5 * 1024 * 1024, "Tamanho máximo 5MB");

const schema = z.object({
  title: z.string().min(1, "Informe o título"),
  year: z.coerce.number().int().min(1888).max(2100),
  genres: z.string().optional(),
  posterFile: fileSchema.optional(),
  trailerYouTubeId: z.string().optional(),
  overview: z.string().optional(),
});

type FormMoviesInput = z.input<typeof schema>;
export type FormMoviesValues = z.output<typeof schema>;

interface FormMoviesDataProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: FormMoviesValues) => void | Promise<void>;
  defaultValues?: Partial<FormMoviesInput>;
}

export const FormMoviesData = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: FormMoviesDataProps) => {
  const form = useForm<FormMoviesInput, unknown, FormMoviesValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      genres: "",
      posterFile: undefined,
      trailerYouTubeId: "",
      overview: "",
      ...defaultValues,
    } as Partial<FormMoviesInput>,
  });

  const submitting = form.formState.isSubmitting;

  const handleSubmit: SubmitHandler<FormMoviesValues> = async (values) => {
    await onSubmit?.(values);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[520px] bg-bg-elev text-fg"
      >
        <SheetHeader>
          <SheetTitle>Novo filme</SheetTitle>
          <SheetDescription>
            Preencha os dados para adicionar um filme.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-bg text-fg"
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e)
                        }
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-bg text-fg"
                          name={field.name}
                          ref={field.ref}
                          value={field.value == null ? "" : String(field.value)}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e)
                          }
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gêneros</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-bg text-fg"
                          placeholder="Ação, Aventura"
                          name={field.name}
                          ref={field.ref}
                          value={field.value ?? ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e)
                          }
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="posterFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster do filme (JPG/PNG)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="bg-bg text-fg file:mr-3 file:rounded file:border file:border-white/10 file:bg-black/20 file:px-3 file:py-1"
                        name={field.name}
                        ref={field.ref}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e.currentTarget.files?.[0])
                        }
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trailerYouTubeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trailer (YouTube ID)</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-bg text-fg"
                        placeholder="lcwmDAYt22k"
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e)
                        }
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sinopse</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-bg text-fg min-h-28"
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? ""}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          field.onChange(e)
                        }
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="mt-6">
                <SheetClose asChild>
                  <AppButton variant="secondary" type="button">
                    Cancelar
                  </AppButton>
                </SheetClose>
                <AppButton type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar"}
                </AppButton>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
