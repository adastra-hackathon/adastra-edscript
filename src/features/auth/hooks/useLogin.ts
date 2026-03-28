import { useState, useCallback } from 'react';
import { useAuth } from '../../../core/hooks/useAuth';
import { authService } from '../services/authService';
import { mapApiError, type MappedError } from '../../../core/errors/mapApiError';
import type { LoginFormData } from '../schemas/login.schema';

interface UseLoginResult {
  submit: (data: LoginFormData) => Promise<MappedError | null>;
  loading: boolean;
  fieldErrors: Record<string, string>;
  globalError: string | null;
  clearFieldError: (field: string) => void;
}

export function useLogin(): UseLoginResult {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mapped, setMapped] = useState<MappedError>({ fieldErrors: {}, globalError: null });

  const submit = useCallback(
    async (data: LoginFormData): Promise<MappedError | null> => {
      try {
        setLoading(true);
        setMapped({ fieldErrors: {}, globalError: null });

        const { user, accessToken, refreshToken } = await authService.login({
          identifier: data.identifier,
          password: data.password,
        });
        await login(user, accessToken, refreshToken);
        return null;
      } catch (err) {
        const result = mapApiError(err);
        if (result.fieldErrors.email || result.fieldErrors.cpf) {
          result.fieldErrors.identifier = result.fieldErrors.email ?? result.fieldErrors.cpf ?? '';
          delete result.fieldErrors.email;
          delete result.fieldErrors.cpf;
        }
        setMapped(result);
        return result;
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
