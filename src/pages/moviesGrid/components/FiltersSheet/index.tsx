/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { AppButton } from "@/components/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getMoviesGenres, getMoviesStudios } from "@/service/moviesApi";
import type { GenresDTO, StudioDTO } from "@/service/moviesApi/types";
import type { MovieFilters } from "../..";

const YEAR_MIN = 1888;
const YEAR_MAX = 2100;
const RUNTIME_MIN = 0;
const RUNTIME_MAX = 300;

const filtersSchema = z.object({
  yearRange: z.tuple([z.number(), z.number()]).optional(),
  runtimeRange: z.tuple([z.number(), z.number()]).optional(),
  studioId: z.string().optional(),
  genreId: z.string().optional(),
});

export type FiltersForm = z.infer<typeof filtersSchema>;

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Partial<FiltersForm>;
  onApply: (params: {
    q?: string;
    startYear?: number;
    endYear?: number;
    runtimeMin?: number;
    runtimeMax?: number;
    studioId?: string;
    genreId?: string;
  }) => void | Promise<void>;
  setFilters: Dispatch<SetStateAction<Partial<MovieFilters>>>;
};

export function FiltersSheet({
  open,
  onOpenChange,
  initial,
  setFilters,
}: Props) {
  const form = useForm<FiltersForm>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      yearRange: initial?.yearRange ?? [YEAR_MIN, YEAR_MAX],
      runtimeRange: initial?.runtimeRange ?? [RUNTIME_MIN, 180],
      studioId: initial?.studioId ?? "",
      genreId: initial?.genreId ?? "",
    },
    mode: "onChange",
  });

  const [studios, setStudios] = useState<StudioDTO[]>([]);
  const [genres, setGenres] = useState<GenresDTO[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [s, g] = await Promise.all([
          getMoviesStudios(),
          getMoviesGenres(),
        ]);
        setStudios(
          Array.isArray((s as any)?.items) ? (s as any).items : (s as any)
        );
        setGenres(
          Array.isArray((g as any)?.items) ? (g as any).items : (g as any)
        );
      } catch {
        //
      }
    })();
  }, []);

  function apply() {
    const v = form.getValues();

    setFilters((prev) => ({
      ...prev,
      startYear: v.yearRange?.[0],
      endYear: v.yearRange?.[1],
      runtimeMin: v.runtimeRange?.[0],
      runtimeMax: v.runtimeRange?.[1],
      studioId: v.studioId,
      genreId: v.genreId,
    }));

    onOpenChange(false);
  }

  function clearAll() {
    form.reset({
      yearRange: [YEAR_MIN, YEAR_MAX],
      runtimeRange: [RUNTIME_MIN, 180],
      studioId: "",
      genreId: "",
    });
  }

  const yearRange = form.watch("yearRange") ?? [YEAR_MIN, YEAR_MAX];
  const runtimeRange = form.watch("runtimeRange") ?? [RUNTIME_MIN, 180];
  const studioId = form.watch("studioId") ?? "";
  const genreId = form.watch("genreId") ?? "";

  const studioLabel =
    studios.find((s) => s.id === studioId)?.name ?? "Selecionar estúdio";
  const genreLabel =
    genres.find((g) => g.id === genreId)?.name ?? "Selecionar gênero";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[380px] sm:w-[420px] bg-bg-elev text-fg p-2"
      >
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Ano</span>
              <span className="tabular-nums">
                {yearRange[0]} — {yearRange[1]}
              </span>
            </div>
            <Slider
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              value={yearRange}
              onValueChange={(v) =>
                form.setValue("yearRange", [v[0], v[1]] as [number, number], {
                  shouldDirty: true,
                })
              }
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Duração (min)</span>
              <span className="tabular-nums">
                {runtimeRange[0]} — {runtimeRange[1]} min
              </span>
            </div>
            <Slider
              min={RUNTIME_MIN}
              max={RUNTIME_MAX}
              step={5}
              value={runtimeRange}
              onValueChange={(v) =>
                form.setValue(
                  "runtimeRange",
                  [v[0], v[1]] as [number, number],
                  { shouldDirty: true }
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Estúdio</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-10 w-full rounded-md border border-white/10 bg-bg px-3 text-left text-fg flex items-center justify-between">
                  <span className={cn(!studioId && "text-mauve-10")}>
                    {studioLabel}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Buscar estúdio..." />
                  <CommandEmpty>Nenhum estúdio encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    <CommandItem
                      onSelect={() =>
                        form.setValue("studioId", "", { shouldDirty: true })
                      }
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !studioId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      (Todos)
                    </CommandItem>
                    {studios.map((s) => (
                      <CommandItem
                        key={s.id}
                        onSelect={() =>
                          form.setValue("studioId", s.id, { shouldDirty: true })
                        }
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            studioId === s.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {s.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Gênero</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-10 w-full rounded-md border border-white/10 bg-bg px-3 text-left text-fg flex items-center justify-between">
                  <span className={cn(!genreId && "text-mauve-10")}>
                    {genreLabel}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Buscar gênero..." />
                  <CommandEmpty>Nenhum gênero encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    <CommandItem
                      onSelect={() =>
                        form.setValue("genreId", "", { shouldDirty: true })
                      }
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !genreId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      (Todos)
                    </CommandItem>
                    {genres.map((g) => (
                      <CommandItem
                        key={g.id}
                        onSelect={() =>
                          form.setValue("genreId", g.id, { shouldDirty: true })
                        }
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            genreId === g.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {g.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <SheetFooter className="mt-6 flex gap-2">
          <AppButton variant="subtle" type="button" onClick={clearAll}>
            Limpar
          </AppButton>
          <AppButton type="button" onClick={apply}>
            Aplicar
          </AppButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
