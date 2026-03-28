import { useState, useCallback } from 'react';
import { useAuth } from '../../../core/hooks/useAuth';
import { authService } from '../services/authService';
import { mapApiError, type MappedError } from '../../../core/errors/mapApiError';
import type { RegisterFormData } from '../schemas/register.schema';

interface UseRegisterResult {
  submit: (data: RegisterFormData) => Promise<MappedError | null>;
  loading: boolean;
  fieldErrors: Record<string, string>;
  globalError: string | null;
  clearFieldError: (field: string) => void;
}

function formatBirthDate(ddmmyyyy: string): string {
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
}

export function useRegister(): UseRegisterResult {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mapped, setMapped] = useState<MappedError>({ fieldErrors: {}, globalError: null });

  const submit = useCallback(
    async (data: RegisterFormData): Promise<MappedError | null> => {
      try {
        setLoading(true);
        setMapped({ fieldErrors: {}, globalError: null });

        const payload = {
          fullName: data.fullName,
          email: data.email,
          cpf: data.cpf,
          phone: data.phone,
          birthDate: formatBirthDate(data.birthDate),
          password: data.password,
          acceptBonus: data.acceptBonus ?? false,
        };

        const { user, accessToken, refreshToken } = await authService.register(payload);
        console.log('Login successful:', { user, accessToken, refreshToken });
        await login(user, accessToken, refreshToken);
        return null;
      } catch (err) {
        const error = mapApiError(err);
        setMapped(error);
        return error;
      } finally {
        setLoading(false);
      }
    },
    [login],
  );

  const clearFieldError = useCallback((field: string) => {
    setMapped(prev => {
      if (!prev.fieldErrors[field]) return prev;
      const updated = { ...prev.fieldErrors };
      delete updated[field];
      return { ...prev, fieldErrors: updated };
    });
  }, []);

  return { submit, loading, fieldErrors: mapped.fieldErrors, globalError: mapped.globalError, clearFieldError };
}
