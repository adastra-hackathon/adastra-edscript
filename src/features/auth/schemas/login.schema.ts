import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Informe seu e-mail ou CPF')
    .trim(),
  password: z
    .string()
    .min(1, 'Informe sua senha'),
  keepConnected: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
