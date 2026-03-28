import { z } from 'zod';

const positiveOrEmpty = z
  .string()
  .optional()
  .refine((v) => !v || (!isNaN(Number(v)) && Number(v) > 0), {
    message: 'Informe um valor positivo válido.',
  });

export const depositLimitSchema = z
  .object({
    daily: positiveOrEmpty,
    weekly: positiveOrEmpty,
    monthly: positiveOrEmpty,
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

export type DepositLimitFormValues = z.infer<typeof depositLimitSchema>;
