import { z } from 'zod';

export const SELF_EXCLUSION_DURATION_OPTIONS = [
  { label: 'Sem limites aplicados.', value: '' },
  { label: '3 meses', value: '3_MONTHS' },
  { label: '6 meses', value: '6_MONTHS' },
  { label: '1 ano', value: '1_YEAR' },
  { label: '2 anos', value: '2_YEARS' },
  { label: 'Permanente', value: 'PERMANENT' },
] as const;

export const selfExclusionSchema = z.object({
  duration: z
    .enum(['3_MONTHS', '6_MONTHS', '1_YEAR', '2_YEARS', 'PERMANENT', ''])
    .nullable()
    .optional(),
  reason: z.string().max(500).optional(),
});

export type SelfExclusionFormValues = z.infer<typeof selfExclusionSchema>;
