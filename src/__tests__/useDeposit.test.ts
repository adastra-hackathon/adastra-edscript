import { renderHook, act } from '@testing-library/react-native';
import { useDeposit } from '../features/wallet/hooks/useDeposit';

describe('useDeposit', () => {
  describe('initial state', () => {
    it('starts with method = "pix"', () => {
      const { result } = renderHook(() => useDeposit());
      expect(result.current.method).toBe('pix');
    });

    it('starts with empty amountText', () => {
      const { result } = renderHook(() => useDeposit());
      expect(result.current.amountText).toBe('');
    });

    it('starts with no quick amount selected', () => {
      const { result } = renderHook(() => useDeposit());
      expect(result.current.selectedQuickAmount).toBeNull();
    });

    it('starts with status = "idle"', () => {
      const { result } = renderHook(() => useDeposit());
      expect(result.current.status).toBe('idle');
    });

    it('starts with copied = false', () => {
      const { result } = renderHook(() => useDeposit());
      expect(result.current.copied).toBe(false);
    });

    it('starts with no amountError', () => {
      const { result } = renderHook(() => useDeposit());
      expect(result.current.amountError).toBeUndefined();
    });
  });

  describe('setMethod', () => {
    it('changes the active payment method', () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.setMethod('credit'); });

      expect(result.current.method).toBe('credit');
    });

    it('clears amountError when method changes', () => {
      const { result } = renderHook(() => useDeposit());

      // trigger an error first
      act(() => { result.current.setAmountText(''); });
      act(() => { result.current.submit(); });

      act(() => { result.current.setMethod('debit'); });

      expect(result.current.amountError).toBeUndefined();
    });
  });

  describe('selectQuickAmount', () => {
    it('sets selectedQuickAmount', () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.selectQuickAmount(100); });

      expect(result.current.selectedQuickAmount).toBe(100);
    });

    it('updates amountText to the chip value', () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.selectQuickAmount(200); });

      expect(result.current.amountText).toBe('200');
    });

    it('clears amountError on chip select', () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.setAmountText(''); });

      act(() => { result.current.selectQuickAmount(50); });

      expect(result.current.amountError).toBeUndefined();
    });
  });

  describe('setAmountText', () => {
    it('clears selectedQuickAmount when typing manually', () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.selectQuickAmount(500); });
      act(() => { result.current.setAmountText('300'); });

      expect(result.current.selectedQuickAmount).toBeNull();
    });
  });

  describe('submit — validation', () => {
    it('sets amountError when amount is empty', async () => {
      const { result } = renderHook(() => useDeposit());

      await act(async () => { await result.current.submit(); });

      expect(result.current.amountError).toBeDefined();
      expect(result.current.status).toBe('idle');
    });

    it('sets amountError when amount is below minimum (R$10)', async () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.setAmountText('5'); });

      await act(async () => { await result.current.submit(); });

      expect(result.current.amountError).toMatch(/mínimo/i);
    });

    it('does not submit when validation fails', async () => {
      const { result } = renderHook(() => useDeposit());

      await act(async () => { await result.current.submit(); });

      expect(result.current.status).toBe('idle');
    });
  });

  describe('submit — success flow', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('sets status to "submitting" then "success"', async () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.selectQuickAmount(100); });

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
    it('restores all state to initial values', async () => {
      const { result } = renderHook(() => useDeposit());

      act(() => {
        result.current.setMethod('boleto');
        result.current.selectQuickAmount(500);
      });

      act(() => { result.current.reset(); });

      expect(result.current.method).toBe('pix');
      expect(result.current.amountText).toBe('');
      expect(result.current.selectedQuickAmount).toBeNull();
      expect(result.current.status).toBe('idle');
    });
  });

  describe('copyPixKey', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('sets copied to true immediately', () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.copyPixKey(); });

      expect(result.current.copied).toBe(true);
    });

    it('resets copied to false after 2 seconds', () => {
      const { result } = renderHook(() => useDeposit());

      act(() => { result.current.copyPixKey(); });
      act(() => { jest.advanceTimersByTime(2000); });

      expect(result.current.copied).toBe(false);
    });
  });
});
