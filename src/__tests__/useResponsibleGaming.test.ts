import { renderHook, act, waitFor } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from 'expo-secure-store';
import { useResponsibleGaming } from '../features/responsible-gaming/hooks/useResponsibleGaming';

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('useResponsibleGaming', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.setItemAsync.mockResolvedValue();
    mockSecureStore.deleteItemAsync.mockResolvedValue();
  });

  it('should show modal on first access (no storage data)', async () => {
    mockSecureStore.getItemAsync.mockResolvedValue(null);

    const { result } = renderHook(() => useResponsibleGaming());

    await waitFor(() => {
      expect(result.current.shouldShow).toBe(true);
    });
  });

  it('should NOT show modal if seen recently (within 7 days)', async () => {
    mockSecureStore.getItemAsync.mockImplementation((key) => {
      if (key === 'responsible_gaming_seen') return Promise.resolve('true');
      if (key === 'responsible_gaming_last_shown')
        return Promise.resolve(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString());
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useResponsibleGaming());

    await waitFor(() => {
      expect(result.current.shouldShow).toBe(false);
    });
  });

  it('should show modal again after 7 days', async () => {
    mockSecureStore.getItemAsync.mockImplementation((key) => {
      if (key === 'responsible_gaming_seen') return Promise.resolve('true');
      if (key === 'responsible_gaming_last_shown')
        return Promise.resolve(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString());
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useResponsibleGaming());

    await waitFor(() => {
      expect(result.current.shouldShow).toBe(true);
    });
  });

  it('should hide modal and persist after confirmRead', async () => {
    mockSecureStore.getItemAsync.mockResolvedValue(null);

    const { result } = renderHook(() => useResponsibleGaming());
    await waitFor(() => expect(result.current.shouldShow).toBe(true));

    act(() => {
      result.current.confirmRead();
    });

    expect(result.current.shouldShow).toBe(false);
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('responsible_gaming_seen', 'true');
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      'responsible_gaming_last_shown',
      expect.any(String),
    );
  });

  it('should show modal when forceShow is called', async () => {
    mockSecureStore.getItemAsync.mockImplementation((key) => {
      if (key === 'responsible_gaming_seen') return Promise.resolve('true');
      if (key === 'responsible_gaming_last_shown')
        return Promise.resolve(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString());
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useResponsibleGaming());
    await waitFor(() => expect(result.current.shouldShow).toBe(false));

    act(() => {
      result.current.forceShow();
    });

    expect(result.current.shouldShow).toBe(true);
  });
});
