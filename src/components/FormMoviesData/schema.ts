import { z } from "zod";

const fileSchema = z
  .instanceof(File)
  .refine(
    (f) => ["image/jpeg", "image/png"].includes(f.type),
    "Apenas JPG ou PNG"
  )
  .refine((f) => f.size <= 5 * 1024 * 1024, "Tamanho máximo 5MB");

export const StatusEnum = z.enum([
  "RELEASED",
  "ANNOUNCED",
  "CANCELED",
  "IN_PRODUCTION",
]);
export const ContentRatingEnum = z.enum([
  "ALL_AGES",
  "AGE_10",
  "AGE_12",
  "AGE_14",
  "AGE_16",
  "AGE_18",
]);

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema);

export const movieFormSchema = z.object({
  title: z.string().min(1, "Informe o título"),
  originalTitle: z.string().min(1, "Informe o título original"),
  subtitle: z.string().optional(),

  releaseYear: z.coerce.number().int().min(1888).max(2100),

  runtimeMinutes: emptyToUndefined(
    z.coerce.number().int().positive().optional()
  ),
  budget: emptyToUndefined(z.coerce.number().nonnegative().optional()),
  revenue: emptyToUndefined(z.coerce.number().nonnegative().optional()),
  profit: emptyToUndefined(z.coerce.number().nonnegative().optional()),

  genres: z.array(z.string()).default([]),
  posterFile: fileSchema.optional(),
  trailerYouTubeId: z.string().optional(),
  overview: z.string().optional(),

  contentRating: ContentRatingEnum,
  status: StatusEnum,

  studioId: z.string().uuid("Selecione um estúdio válido"),
});

export type MovieFormInput = z.input<typeof movieFormSchema>;
export type MovieFormValues = z.output<typeof movieFormSchema>;
