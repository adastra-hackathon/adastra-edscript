import { renderHook, act } from '@testing-library/react-native';
import { useWithdraw } from '../features/wallet/hooks/useWithdraw';
import { useAuthStore } from '../store/authStore';

// Mock the auth store so we can control the user balance
jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

function setupBalance(balance: number) {
  mockUseAuthStore.mockImplementation((selector: any) =>
    selector({ user: { balance }, isAuthenticated: true } as any),
  );
}

describe('useWithdraw', () => {
  beforeEach(() => {
    setupBalance(1000);
  });

  describe('initial state', () => {
    it('starts with pixKeyType = "cpf"', () => {
      const { result } = renderHook(() => useWithdraw());
      expect(result.current.pixKeyType).toBe('cpf');
    });

    it('starts with empty pixKey', () => {
      const { result } = renderHook(() => useWithdraw());
      expect(result.current.pixKey).toBe('');
    });

    it('starts with empty amountText', () => {
      const { result } = renderHook(() => useWithdraw());
      expect(result.current.amountText).toBe('');
    });

    it('starts with status = "idle"', () => {
      const { result } = renderHook(() => useWithdraw());
      expect(result.current.status).toBe('idle');
    });

    it('starts with no errors', () => {
      const { result } = renderHook(() => useWithdraw());
      expect(result.current.pixKeyError).toBeUndefined();
      expect(result.current.amountError).toBeUndefined();
    });
  });

  describe('setPixKeyType', () => {
    it('changes the key type', () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => { result.current.setPixKeyType('email'); });

      expect(result.current.pixKeyType).toBe('email');
    });

    it('clears pixKey and pixKeyError when switching type', () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => { result.current.setPixKey('123.456.789-00'); });
      act(() => { result.current.setPixKeyType('phone'); });

      expect(result.current.pixKey).toBe('');
      expect(result.current.pixKeyError).toBeUndefined();
    });
  });

  describe('selectQuickAmount', () => {
    it('sets selectedQuickAmount and amountText', () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => { result.current.selectQuickAmount(200); });

      expect(result.current.selectedQuickAmount).toBe(200);
      expect(result.current.amountText).toBe('200');
    });

    it('clears selectedQuickAmount when typing manually', () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => { result.current.selectQuickAmount(100); });
      act(() => { result.current.setAmountText('75'); });

      expect(result.current.selectedQuickAmount).toBeNull();
    });
  });

  describe('submit — validation', () => {
    it('sets pixKeyError when pixKey is empty', async () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => { result.current.setAmountText('100'); });

      await act(async () => { await result.current.submit(); });

      expect(result.current.pixKeyError).toBeDefined();
    });

    it('sets amountError when amount is empty', async () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => { result.current.setPixKey('123.456.789-00'); });

      await act(async () => { await result.current.submit(); });

      expect(result.current.amountError).toBeDefined();
    });

    it('rejects amount below minimum (R$50)', async () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => {
        result.current.setPixKey('user@test.com');
        result.current.setAmountText('30');
      });

      await act(async () => { await result.current.submit(); });

      expect(result.current.amountError).toMatch(/mínimo/i);
    });

    it('rejects amount above maximum (R$10.000)', async () => {
      const { result } = renderHook(() => useWithdraw());

      act(() => {
        result.current.setPixKey('user@test.com');
        result.current.setAmountText('15000');
      });

      await act(async () => { await result.current.submit(); });

      expect(result.current.amountError).toMatch(/máximo/i);
    });

    it('rejects amount greater than available balance', async () => {
      setupBalance(100);
      const { result } = renderHook(() => useWithdraw());

      act(() => {
        result.current.setPixKey('user@test.com');
        result.current.setAmountText('200');
      });

      await act(async () => { await result.current.submit(); });

      expect(result.current.amountError).toMatch(/saldo/i);
    });

    it('does not submit when validation fails', async () => {
      const { result } = renderHook(() => useWithdraw());

      await act(async () => { await result.current.submit(); });

      expect(result.current.status).toBe('idle');
    });

    it('allows minimum valid amount (R$50) when balance is sufficient', async () => {
      setupBalance(1000);
      const { result } = renderHook(() => useWithdraw());

      act(() => {
        result.current.setPixKey('user@test.com');
        result.current.setAmountText('50');
      });

      // Should not set amountError (will go to submitting/success)
      await act(async () => { await result.current.submit(); });

      expect(result.current.amountError).toBeUndefined();
    });
  });

  describe('submit — success flow', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('sets status to "submitting" then "success"', async () => {
      setupBalance(1000);
      const { result } = renderHook(() => useWithdraw());

      act(() => {
        result.current.setPixKey('user@test.com');
        result.current.selectQuickAmount(100);
      });

      let submitPromise: Promise<void>;
      act(() => { submitPromise = result.current.submit(); });

      expect(result.current.status).toBe('submitting');

      await act(async () => {
        jest.runAllTimers();
        await submitPromise;
      });

      expect(result.current.status).toBe('success');
    });
  });

  describe('reset', () => {
    it('restores all fields to initial values', () => {
      setupBalance(1000);
      const { result } = renderHook(() => useWithdraw());

      act(() => {
        result.current.setPixKeyType('random');
        result.current.setPixKey('abc-key-123');
        result.current.selectQuickAmount(500);
      });

      act(() => { result.current.reset(); });

      expect(result.current.pixKeyType).toBe('cpf');
      expect(result.current.pixKey).toBe('');
      expect(result.current.amountText).toBe('');
      expect(result.current.selectedQuickAmount).toBeNull();
      expect(result.current.status).toBe('idle');
    });
  });
});
