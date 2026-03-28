import { z } from 'zod';

const intOrEmpty = z
  .string()
  .optional()
  .refine((v) => !v || (Number.isInteger(Number(v)) && Number(v) > 0), {
    message: 'Informe um número inteiro positivo de minutos.',
  });

export const sessionTimeLimitSchema = z
  .object({
    daily: intOrEmpty,
    weekly: intOrEmpty,
    monthly: intOrEmpty,
    reason: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    const d = data.daily ? Number(data.daily) : null;
    const w = data.weekly ? Number(data.weekly) : null;
    const m = data.monthly ? Number(data.monthly) : null;
    if (d && w && w < d) {
      ctx.addIssue({ code: 'custom', path: ['weekly'], message: 'Limite semanal não pode ser menor que o diário.' });
    }
    if (w && m && m < w) {
      ctx.addIssue({ code: 'custom', path: ['monthly'], message: 'Limite mensal não pode ser menor que o semanal.' });
    }
  });

export type SessionTimeLimitFormValues = z.infer<typeof sessionTimeLimitSchema>;
