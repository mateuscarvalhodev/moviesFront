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
import { createMovie } from "@/service/moviesApi";

const fileSchema = z
  .instanceof(File)
  .refine(
    (f) => ["image/jpeg", "image/png"].includes(f.type),
    "Apenas JPG ou PNG"
  )
  .refine((f) => f.size <= 5 * 1024 * 1024, "Tamanho máximo 5MB");

const StatusEnum = z.enum([
  "RELEASED",
  "ANNOUNCED",
  "CANCELED",
  "IN_PRODUCTION",
]);
const ContentRatingEnum = z.enum(["ALL_AGES", "PG", "PG_13", "R", "NC_17"]);

const schema = z.object({
  title: z.string().min(1, "Informe o título"),
  originalTitle: z.string().min(1, "Informe o título original"),
  subtitle: z.string().optional(),
  year: z.coerce.number().int().min(1888).max(2100),
  runtimeMinutes: z.coerce.number().int().positive().optional(),
  genres: z.string().optional(),
  posterFile: fileSchema.optional(),
  trailerYouTubeId: z.string().optional(),
  overview: z.string().optional(),
  contentRating: ContentRatingEnum,
  status: StatusEnum,
  budget: z.coerce.number().nonnegative().optional(),
  revenue: z.coerce.number().nonnegative().optional(),
  profit: z.coerce.number().nonnegative().optional(),
  studioName: z.string().min(1, "Informe o estúdio"),
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
      originalTitle: "",
      subtitle: "",
      year: new Date().getFullYear(),
      runtimeMinutes: undefined,
      genres: "",
      posterFile: undefined,
      trailerYouTubeId: "",
      overview: "",
      contentRating: "ALL_AGES",
      status: "RELEASED",
      budget: undefined,
      revenue: undefined,
      profit: undefined,
      studioName: "",
      ...defaultValues,
    } as Partial<FormMoviesInput>,
  });

  const submitting = form.formState.isSubmitting;

  const handleSubmit: SubmitHandler<FormMoviesValues> = async (values) => {
    try {
      const created = await createMovie(values);
      await onSubmit?.(values);
      onOpenChange(false);
      console.log("Filme adicionado:", created);
    } catch (err) {
      console.error("Falha ao criar filme:", err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[520px] bg-bg-elev text-fg"
      >
        <SheetHeader>
          <SheetTitle>Novo filme</SheetTitle>
          <SheetDescription>Adicione um filme.</SheetDescription>
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
                  name="originalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título original</FormLabel>
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
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
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
                          placeholder="Opcional"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  name="runtimeMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (min)</FormLabel>
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
                          placeholder="Opcional"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="contentRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classificação</FormLabel>
                      <FormControl>
                        <select
                          className="h-10 w-full rounded-md border border-white/10 bg-bg px-3 text-fg"
                          name={field.name}
                          ref={field.ref}
                          value={field.value ?? ""}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            field.onChange(e.target.value)
                          }
                          onBlur={field.onBlur}
                        >
                          <option value="ALL_AGES">Livre</option>
                          <option value="PG_13">13+</option>
                          <option value="NC_17">17+</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="h-10 w-full rounded-md border border-white/10 bg-bg px-3 text-fg"
                          name={field.name}
                          ref={field.ref}
                          value={field.value ?? ""}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            field.onChange(e.target.value)
                          }
                          onBlur={field.onBlur}
                        >
                          <option value="RELEASED">Lançado</option>
                          <option value="ANNOUNCED">Anunciado</option>
                          <option value="CANCELED">Cancelado</option>
                          <option value="IN_PRODUCTION">Em produção</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento (USD)</FormLabel>
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
                          placeholder="Opcional"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receita (USD)</FormLabel>
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
                          placeholder="Opcional"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="profit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lucro (USD)</FormLabel>
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
                        placeholder="Opcional"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studioName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estúdio</FormLabel>
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
                        placeholder="Link do trailer"
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
                  <AppButton variant="subtle" type="button">
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
