// ─── Payment Methods ──────────────────────────────────────────────────────────

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'boleto';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  credit: 'Crédito',
  debit: 'Débito',
  boleto: 'Boleto',
};

// ─── Pix Key Types ────────────────────────────────────────────────────────────

export type PixKeyType = 'cpf' | 'email' | 'phone' | 'random';

export const PIX_KEY_TYPE_LABELS: Record<PixKeyType, string> = {
  cpf: 'CPF',
  email: 'E-mail',
  phone: 'Telefone',
  random: 'Chave aleatória',
};

export const PIX_KEY_TYPE_PLACEHOLDERS: Record<PixKeyType, string> = {
  cpf: '000.000.000-00',
  email: 'seu@email.com',
  phone: '(11) 99999-9999',
  random: 'Cole sua chave aleatória',
};

// ─── Quick Amount Chips ───────────────────────────────────────────────────────

export const QUICK_AMOUNTS = [50, 100, 200, 500] as const;

// ─── Deposit ─────────────────────────────────────────────────────────────────

export interface DepositPayload {
  method: PaymentMethod;
  amount: number;
}

export type DepositStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── Withdraw ────────────────────────────────────────────────────────────────

export interface WithdrawPayload {
  pixKeyType: PixKeyType;
  pixKey: string;
  amount: number;
}

export type WithdrawStatus = 'idle' | 'submitting' | 'success' | 'error';

export const WITHDRAW_MIN = 50;
export const WITHDRAW_MAX = 10_000;
