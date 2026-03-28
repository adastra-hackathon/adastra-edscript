import { act, renderHook } from '@testing-library/react-native';
import { useBetslipStore } from '../features/betslip/store/betslipStore';

// Helper to create a selection payload (without id/stake which the store adds)
const makeSel = (overrides = {}) => ({
  eventId: 'ev-1',
  eventName: 'Team A vs Team B',
  marketName: 'Resultado',
  selectionName: 'Team A',
  odd: 2.45,
  ...overrides,
});

// Reset store between tests
beforeEach(() => {
  act(() => {
    useBetslipStore.getState().clearSlip();
    useBetslipStore.setState({ mode: 'multiple', multipleStake: 10 });
  });
});

describe('betslipStore — initial state', () => {
  it('starts with empty selections', () => {
    const { result } = renderHook(() => useBetslipStore());
    expect(result.current.selections).toHaveLength(0);
  });

  it('starts with mode = "multiple"', () => {
    const { result } = renderHook(() => useBetslipStore());
    expect(result.current.mode).toBe('multiple');
  });

  it('starts with multipleStake = 10', () => {
    const { result } = renderHook(() => useBetslipStore());
    expect(result.current.multipleStake).toBe(10);
  });

  it('starts with both odds options false', () => {
    const { result } = renderHook(() => useBetslipStore());
    expect(result.current.oddsOptions.acceptAnyOddsChange).toBe(false);
    expect(result.current.oddsOptions.acceptOnlyHigherOdds).toBe(false);
  });
});

describe('betslipStore — setMode', () => {
  it('changes the active mode', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.setMode('simple'));
    expect(result.current.mode).toBe('simple');
  });

  it('can switch between all three modes', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.setMode('system'));
    expect(result.current.mode).toBe('system');
    act(() => result.current.setMode('multiple'));
    expect(result.current.mode).toBe('multiple');
  });
});

describe('betslipStore — addSelection', () => {
  it('adds a selection to the store', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel()));
    expect(result.current.selections).toHaveLength(1);
  });

  it('assigns a unique id to the selection', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel()));
    expect(result.current.selections[0].id).toBeDefined();
  });

  it('sets default stake = 10 for new selection', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel()));
    expect(result.current.selections[0].stake).toBe(10);
  });

  it('does not add duplicate eventId', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-1' })));
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-1' })));
    expect(result.current.selections).toHaveLength(1);
  });

  it('allows different eventIds', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-1' })));
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-2' })));
    expect(result.current.selections).toHaveLength(2);
  });
});

describe('betslipStore — removeSelection', () => {
  it('removes a selection by id', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel()));
    const id = result.current.selections[0].id;
    act(() => result.current.removeSelection(id));
    expect(result.current.selections).toHaveLength(0);
  });

  it('only removes the targeted selection', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-1' })));
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-2' })));
    const id = result.current.selections[0].id;
    act(() => result.current.removeSelection(id));
    expect(result.current.selections).toHaveLength(1);
    expect(result.current.selections[0].eventId).toBe('ev-2');
  });
});

describe('betslipStore — updateSelectionStake', () => {
  it('updates the stake for a specific selection', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel()));
    const id = result.current.selections[0].id;
    act(() => result.current.updateSelectionStake(id, 25));
    expect(result.current.selections[0].stake).toBe(25);
  });

  it('does not affect other selections', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-1' })));
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-2' })));
    const id = result.current.selections[0].id;
    act(() => result.current.updateSelectionStake(id, 50));
    expect(result.current.selections[1].stake).toBe(10);
  });
});

describe('betslipStore — setMultipleStake', () => {
  it('updates the shared stake for multiple/system mode', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.setMultipleStake(25));
    expect(result.current.multipleStake).toBe(25);
  });
});

describe('betslipStore — setOddsOptions', () => {
  it('toggles acceptAnyOddsChange', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.setOddsOptions({ acceptAnyOddsChange: true }));
    expect(result.current.oddsOptions.acceptAnyOddsChange).toBe(true);
  });

  it('partial update does not affect other options', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.setOddsOptions({ acceptOnlyHigherOdds: true }));
    expect(result.current.oddsOptions.acceptAnyOddsChange).toBe(false);
    expect(result.current.oddsOptions.acceptOnlyHigherOdds).toBe(true);
  });
});

describe('betslipStore — clearSlip', () => {
  it('removes all selections', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-1' })));
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-2' })));
    act(() => result.current.clearSlip());
    expect(result.current.selections).toHaveLength(0);
  });

  it('resets multipleStake to 10', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.setMultipleStake(100));
    act(() => result.current.clearSlip());
    expect(result.current.multipleStake).toBe(10);
  });
});

describe('betslipStore — hasSelection', () => {
  it('returns false when eventId is not in selections', () => {
    const { result } = renderHook(() => useBetslipStore());
    expect(result.current.hasSelection('ev-999')).toBe(false);
  });

  it('returns true when eventId is in selections', () => {
    const { result } = renderHook(() => useBetslipStore());
    act(() => result.current.addSelection(makeSel({ eventId: 'ev-42' })));
    expect(result.current.hasSelection('ev-42')).toBe(true);
  });
});
