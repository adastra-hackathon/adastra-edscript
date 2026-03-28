import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../store/authStore';
import type { PixKeyType, WithdrawStatus } from '../types/wallet.types';
import { WITHDRAW_MIN, WITHDRAW_MAX } from '../types/wallet.types';

const WITHDRAW_DELAY_MS = 1500;

interface UseWithdrawReturn {
  pixKeyType: PixKeyType;
  setPixKeyType: (type: PixKeyType) => void;
  pixKey: string;
  setPixKey: (key: string) => void;
  amountText: string;
  setAmountText: (text: string) => void;
  selectedQuickAmount: number | null;
  selectQuickAmount: (amount: number) => void;
  pixKeyError: string | undefined;
  amountError: string | undefined;
  status: WithdrawStatus;
  submit: () => Promise<void>;
  reset: () => void;
}

function parseAmount(text: string): number {
  const normalized = text.replace(',', '.');
  const value = parseFloat(normalized);
  return isNaN(value) ? 0 : value;
}

export function useWithdraw(): UseWithdrawReturn {
  const balance = useAuthStore((s) => s.user?.balance ?? 0);

  const [pixKeyType, setPixKeyTypeRaw] = useState<PixKeyType>('cpf');
  const [pixKey, setPixKeyRaw] = useState('');
  const [amountText, setAmountTextRaw] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [pixKeyError, setPixKeyError] = useState<string | undefined>(undefined);
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<WithdrawStatus>('idle');

  const setPixKeyType = useCallback((type: PixKeyType) => {
    setPixKeyTypeRaw(type);
    setPixKeyRaw('');
    setPixKeyError(undefined);
  }, []);

  const setPixKey = useCallback((key: string) => {
    setPixKeyRaw(key);
    setPixKeyError(undefined);
  }, []);

  const setAmountText = useCallback((text: string) => {
    setAmountTextRaw(text);
    setSelectedQuickAmount(null);
    setAmountError(undefined);
  }, []);

  const selectQuickAmount = useCallback((amount: number) => {
    setSelectedQuickAmount(amount);
    setAmountTextRaw(String(amount));
    setAmountError(undefined);
  }, []);

  const validate = useCallback((): boolean => {
    let valid = true;

    if (!pixKey.trim()) {
      setPixKeyError('Informe sua chave Pix.');
      valid = false;
    }

    const value = parseAmount(amountText);

    if (!amountText || value <= 0) {
      setAmountError('Informe um valor para sacar.');
      valid = false;
    } else if (value < WITHDRAW_MIN) {
      setAmountError(`Valor mínimo de saque: R$ ${WITHDRAW_MIN},00.`);
      valid = false;
    } else if (value > WITHDRAW_MAX) {
      setAmountError(`Valor máximo de saque: R$ ${WITHDRAW_MAX.toLocaleString('pt-BR')},00.`);
      valid = false;
    } else if (value > balance) {
      setAmountError('Saldo insuficiente para este saque.');
      valid = false;
    }

    return valid;
  }, [pixKey, amountText, balance]);

  const submit = useCallback(async () => {
    if (!validate()) return;
    setStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, WITHDRAW_DELAY_MS));
    setStatus('success');
  }, [validate]);

  const reset = useCallback(() => {
    setPixKeyTypeRaw('cpf');
    setPixKeyRaw('');
    setAmountTextRaw('');
    setSelectedQuickAmount(null);
    setPixKeyError(undefined);
    setAmountError(undefined);
    setStatus('idle');
  }, []);

  return {
    pixKeyType,
    setPixKeyType,
    pixKey,
    setPixKey,
    amountText,
    setAmountText,
    selectedQuickAmount,
    selectQuickAmount,
    pixKeyError,
    amountError,
    status,
    submit,
    reset,
  };
}
