import { z } from "zod";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { getMoviesStudios, getMoviesGenres } from "@/service/moviesApi";
import type { GenresDTO, StudioDTO } from "@/service/moviesApi/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandInput,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Slider } from "../ui/slider";
import { formatUSD, strCurrencyToNumber } from "./utils";

type Studio = { id: string; name: string };

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

const ContentRatingEnum = z.enum([
  "ALL_AGES",
  "AGE_10",
  "AGE_12",
  "AGE_14",
  "AGE_16",
  "AGE_18",
]);

const schema = z.object({
  title: z.string().min(1, "Informe o título"),
  originalTitle: z.string().min(1, "Informe o título original"),
  subtitle: z.string().optional(),
  releaseYear: z.number().int().min(1888).max(2100),
  runtimeMinutes: z.number().int().positive().optional(),
  genres: z.array(z.string()).default([]),
  posterFile: fileSchema.optional(),
  trailerUrl: z.string().optional(),
  overview: z.string().optional(),
  contentRating: ContentRatingEnum,
  status: StatusEnum,
  budget: z.string().optional(),
  revenue: z.string().optional(),
  profit: z.string().optional(),
  studioId: z.string().uuid("Selecione um estúdio válido"),
  approbation: z.number().int().min(1).max(100),
});

type FormMoviesInput = z.input<typeof schema>;
export type FormMoviesValues = z.output<typeof schema>;

export type PayloadMovies = Omit<
  FormMoviesValues,
  "budget" | "revenue" | "profit"
> & {
  budget: number | undefined;
  revenue: number | undefined;
  profit: number | undefined;
};
interface FormMoviesDataProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PayloadMovies) => void | Promise<void>;
  defaultValues?: Partial<FormMoviesInput>;
  mode?: "create" | "edit";
}

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

type MultiSelectOption = { label: string; value: string };
function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: MultiSelectOption[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const valuesSet = new Set(value);

  function toggle(val: string) {
    if (valuesSet.has(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cx(
            "flex w-full min-h-10 items-center justify-between rounded-md border border-white/10 bg-bg px-3 py-2 text-left text-fg",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="text-mauve-10">
                {placeholder ?? "Selecione..."}
              </span>
            ) : (
              value.map((v) => (
                <Badge
                  key={v}
                  variant="secondary"
                  className="bg-mauve-4 text-fg"
                >
                  {options.find((o) => o.value === v)?.label ?? v}
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Buscar gênero..." />
          <CommandEmpty>Nenhum gênero encontrado.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {options.map((opt) => {
              const selected = valuesSet.has(opt.value);
              return (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggle(opt.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cx(
                      "mr-2 h-4 w-4",
                      selected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const FormMoviesData = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: FormMoviesDataProps) => {
  const isEdit = mode === "edit";
  const [studios, setStudios] = useState<Studio[]>([]);
  const [genresList, setGenresList] = useState<GenresDTO[]>([]);
  const [studiosLoading, setStudiosLoading] = useState(false);
  const [studiosError, setStudiosError] = useState<string | undefined>();
  const [genresLoading, setGenresLoading] = useState(false);
  const [genresError, setGenresError] = useState<string | undefined>();

  function normalizeList<T>(raw: unknown): T[] {
    if (Array.isArray(raw)) return raw as T[];
    if (raw && typeof raw === "object" && "items" in raw) {
      const items = (raw as { items?: unknown }).items;
      return Array.isArray(items) ? (items as T[]) : [];
    }
    return [];
  }

  useEffect(() => {
    console.log({ defaultValues });
    let mounted = true;
    (async () => {
      setStudiosLoading(true);
      setStudiosError(undefined);
      try {
        const raw = (await getMoviesStudios()) as unknown;
        const list = normalizeList<StudioDTO>(raw).map((s) => ({
          id: s.id,
          name: s.name,
        }));
        if (mounted) setStudios(list);
      } catch {
        if (mounted) setStudiosError("Falha ao carregar estúdios.");
      } finally {
        if (mounted) setStudiosLoading(false);
      }

      setGenresLoading(true);
      setGenresError(undefined);
      try {
        const raw = (await getMoviesGenres()) as unknown;
        const list = normalizeList<GenresDTO>(raw);
        if (mounted) setGenresList(list);
      } catch {
        if (mounted) setGenresError("Falha ao carregar gêneros.");
      } finally {
        if (mounted) setGenresLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const form = useForm<FormMoviesInput, unknown, FormMoviesValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: defaultValues as Partial<FormMoviesInput>,
  });

  const submitting = form.formState.isSubmitting;

  const handleSubmit: SubmitHandler<FormMoviesValues> = async (values) => {
    const payload = {
      ...values,
      releaseYear: values.releaseYear,
      approbation: values.approbation,
      budget: strCurrencyToNumber(values.budget),
      revenue: strCurrencyToNumber(values.revenue),
      profit: strCurrencyToNumber(values.profit),
    };

    await onSubmit(payload);
    onOpenChange(false);
    if (!isEdit) {
      form.reset(defaultValues);
    }
  };

  function parseNumberOrUndefined(e: ChangeEvent<HTMLInputElement>) {
    const v = e.currentTarget.value;
    return v === "" ? undefined : Number(v);
  }

  function handleMultiSelectChange(next: string[]) {
    form.setValue("genres", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[520px] bg-bg-elev text-fg h-dvh overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar filme" : "Novo filme"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Atualize as informações do filme" : "Adicione um filme."}
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
                        disabled={submitting}
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
                          disabled={submitting}
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
                          disabled={submitting}
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
                  name="releaseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-bg text-fg"
                          name={field.name}
                          ref={field.ref}
                          value={field.value ?? new Date().getFullYear()}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            field.onChange(parseNumberOrUndefined(e))
                          }
                          onBlur={field.onBlur}
                          disabled={submitting}
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
                          value={field.value ?? ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            field.onChange(parseNumberOrUndefined(e))
                          }
                          onBlur={field.onBlur}
                          placeholder="Opcional"
                          disabled={submitting}
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
                          disabled={submitting}
                        >
                          <option value="ALL_AGES">Livre</option>
                          <option value="AGE_10">10+</option>
                          <option value="AGE_12">12+</option>
                          <option value="AGE_14">14+</option>
                          <option value="AGE_16">16+</option>
                          <option value="AGE_18">18+</option>
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
                          disabled={submitting}
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
                          type="text"
                          inputMode="numeric"
                          className="bg-bg text-fg"
                          value={formatUSD(field.value)}
                          onChange={(e) =>
                            field.onChange(e.currentTarget.value)
                          }
                          onBlur={field.onBlur}
                          placeholder="Opcional"
                          disabled={submitting}
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
                          type="text"
                          inputMode="numeric"
                          className="bg-bg text-fg"
                          name={field.name}
                          ref={field.ref}
                          value={formatUSD(field.value)}
                          onChange={(e) =>
                            field.onChange(e.currentTarget.value)
                          }
                          onBlur={field.onBlur}
                          placeholder="Opcional"
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="approbation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota: (1 a 100)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            value={[field.value ?? 50]}
                            onValueChange={(v) => field.onChange(v[0])}
                            onValueCommit={(v) => field.onChange(v[0])}
                            disabled={submitting}
                          />
                        </div>
                        <span className="w-10 text-right tabular-nums">
                          {field.value ?? 50}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
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
                        value={field.value ?? ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          field.onChange(parseNumberOrUndefined(e))
                        }
                        onBlur={field.onBlur}
                        placeholder="Opcional"
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="studioId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estúdio</FormLabel>
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
                        disabled={studiosLoading || submitting}
                      >
                        <option value="" disabled>
                          {studiosLoading
                            ? "Carregando estúdios..."
                            : studiosError ?? "Selecione um estúdio"}
                        </option>
                        {studios.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
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
                      <MultiSelect
                        options={genresList.map((g) => ({
                          label: g.name,
                          value: g.id,
                        }))}
                        value={field.value ?? []}
                        onChange={handleMultiSelectChange}
                        placeholder={
                          genresError ??
                          (genresLoading
                            ? "Carregando..."
                            : "Selecione os gêneros")
                        }
                        disabled={genresLoading || submitting}
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
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trailerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trailer (YouTube ID ou URL)</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-bg text-fg"
                        placeholder="lcwmDAYt22k ou URL"
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e)
                        }
                        onBlur={field.onBlur}
                        disabled={submitting}
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
                        disabled={submitting}
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
