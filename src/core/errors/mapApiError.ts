interface ApiErrorResponse {
  code?: string;
  message?: string;
  translatedMessage?: string;
  field?: string | null;
  errors?: Record<string, string[]>;
}

export interface MappedError {
  /** Erros por campo — exibir inline no input correspondente */
  fieldErrors: Record<string, string>;
  /** Erro global — exibir em toast */
  globalError: string | null;
}

export function mapApiError(err: unknown): MappedError {
  // Sem conexão com o servidor
  if (!err || !(err as any).response) {
    return {
      fieldErrors: {},
      globalError: 'Sem conexão com o servidor. Verifique sua internet.',
    };
  }

  const data: ApiErrorResponse = (err as any).response?.data ?? {};
  const translated = data.translatedMessage ?? data.message ?? 'Erro inesperado. Tente novamente.';

  // Erro de campo específico da API (ex: email, cpf, phone)
  if (data.field) {
    return {
      fieldErrors: { [data.field]: translated },
      globalError: null,
    };
  }

  // Erros de validação Zod do backend (múltiplos campos)
  if (data.errors && typeof data.errors === 'object') {
    const fieldErrors: Record<string, string> = {};
    for (const [field, messages] of Object.entries(data.errors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[field] = messages[0];
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors, globalError: null };
    }
  }

  // Erro global (credenciais inválidas, conta suspensa, etc.)
  return { fieldErrors: {}, globalError: translated };
}
