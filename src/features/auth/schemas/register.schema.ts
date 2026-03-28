import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

function isValidBirthDate(value: string): boolean {
  if (!dateRegex.test(value)) return false;
  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
  const minAge = new Date();
  minAge.setFullYear(minAge.getFullYear() - 18);
  return date <= minAge;
}

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Informe seu nome completo'),
    cpf: z
      .string()
      .min(1, 'Informe seu CPF')
      .regex(cpfRegex, 'CPF inválido'),
    email: z
      .string()
      .min(1, 'Informe seu e-mail')
      .email('E-mail inválido'),
    password: z
      .string()
      .min(8, 'Mínimo de 8 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirme sua senha'),
    birthDate: z
      .string()
      .min(1, 'Informe sua data de nascimento')
      .refine(isValidBirthDate, 'Data inválida ou menor de 18 anos'),
    phone: z
      .string()
      .min(1, 'Informe seu celular')
      .regex(phoneRegex, 'Celular inválido'),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, 'Você deve aceitar os termos'),
    acceptBonus: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

