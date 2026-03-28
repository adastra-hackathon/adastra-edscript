import { z } from 'zod';

export const timedExclusionSchema = z.object({
  untilDate: z
    .string()
    .min(1, 'Selecione uma data.')
    .refine((v) => {
      const date = new Date(v);
      return !isNaN(date.getTime()) && date > new Date();
    }, 'A data deve ser futura.'),
  reason: z.string().max(500).optional(),
});

export type TimedExclusionFormValues = z.infer<typeof timedExclusionSchema>;
