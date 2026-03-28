import React, { memo, useRef, useCallback } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { KeyboardScrollContext } from '../../core/context/KeyboardScrollContext';
import { spacing } from '../../core/theme';

interface Props {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const AuthLayout = memo(function AuthLayout({ children, contentStyle }: Props) {
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const focusedYRef = useRef<number | null>(null);

  const pendingListenerRef = useRef<ReturnType<typeof Keyboard.addListener> | null>(null);

  const setFocusedY = useCallback((y: number) => {
    focusedYRef.current = y;
    // Remove any previous pending listener before registering a new one
    pendingListenerRef.current?.remove();
    pendingListenerRef.current = Keyboard.addListener('keyboardDidShow', (e) => {
      pendingListenerRef.current?.remove();
      pendingListenerRef.current = null;
      const keyboardHeight = e.endCoordinates.height;
      const screenHeight = Dimensions.get('window').height;
      const visibleHeight = screenHeight - keyboardHeight;
      const target = Math.max(0, y - visibleHeight * 0.4);
      scrollRef.current?.scrollTo({ y: target, animated: true });
    });
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <KeyboardScrollContext.Provider value={{ scrollRef, setFocusedY: setFocusedY }}>
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={[styles.scroll, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={Keyboard.dismiss}
          >
            {children}
          </ScrollView>
        </KeyboardScrollContext.Provider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
  },
});
