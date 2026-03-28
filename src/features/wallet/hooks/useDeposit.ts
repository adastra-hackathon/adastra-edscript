import { useState, useCallback } from 'react';
import type { PaymentMethod, DepositStatus } from '../types/wallet.types';

const PIX_KEY_MOCK = 'adastra@pix.com.br';
const DEPOSIT_DELAY_MS = 1500;

interface UseDepositReturn {
  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
  amountText: string;
  setAmountText: (text: string) => void;
  selectedQuickAmount: number | null;
  selectQuickAmount: (amount: number) => void;
  pixKey: string;
  copied: boolean;
  copyPixKey: () => void;
  amountError: string | undefined;
  status: DepositStatus;
  submit: () => Promise<void>;
  reset: () => void;
}

function parseAmount(text: string): number {
  const normalized = text.replace(',', '.');
  const value = parseFloat(normalized);
  return isNaN(value) ? 0 : value;
}

export function useDeposit(): UseDepositReturn {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [amountText, setAmountText] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<DepositStatus>('idle');

  const handleSetAmountText = useCallback((text: string) => {
    setAmountText(text);
    setSelectedQuickAmount(null);
    setAmountError(undefined);
  }, []);

  const selectQuickAmount = useCallback((amount: number) => {
    setSelectedQuickAmount(amount);
    setAmountText(String(amount));
    setAmountError(undefined);
  }, []);

  const handleSetMethod = useCallback((m: PaymentMethod) => {
    setMethod(m);
    setAmountError(undefined);
  }, []);

  const copyPixKey = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const validate = useCallback((): boolean => {
    const value = parseAmount(amountText);
    if (!amountText || value <= 0) {
      setAmountError('Informe um valor para depositar.');
      return false;
    }
    if (value < 10) {
      setAmountError('Valor mínimo de depósito: R$ 10,00.');
      return false;
    }
    return true;
  }, [amountText]);

  const submit = useCallback(async () => {
    if (!validate()) return;
    setStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, DEPOSIT_DELAY_MS));
    setStatus('success');
  }, [validate]);

  const reset = useCallback(() => {
    setMethod('pix');
    setAmountText('');
    setSelectedQuickAmount(null);
    setCopied(false);
    setAmountError(undefined);
    setStatus('idle');
  }, []);

  return {
    method,
    setMethod: handleSetMethod,
    amountText,
    setAmountText: handleSetAmountText,
    selectedQuickAmount,
    selectQuickAmount,
    pixKey: PIX_KEY_MOCK,
    copied,
    copyPixKey,
    amountError,
    status,
    submit,
    reset,
  };
}
