import { createContext, useContext, type RefObject } from 'react';
import type { ScrollView } from 'react-native';

export interface KeyboardScrollContextValue {
  scrollRef: RefObject<ScrollView>;
  setFocusedY: (y: number) => void;
}

export const KeyboardScrollContext = createContext<KeyboardScrollContextValue | null>(null);

export function useKeyboardScroll(): KeyboardScrollContextValue | null {
  return useContext(KeyboardScrollContext);
}
