import React, { memo } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { borderRadius, spacing } from '../../../core/theme';

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  onReset?: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export const LimitModalShell = memo(function LimitModalShell({
  visible,
  title,
  onClose,
  onSave,
  onReset,
  isLoading,
  children,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h3" color={colors.textPrimary} style={styles.headerTitle}>
              {title}
            </AppText>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceOverlay }]}
              accessibilityLabel="Fechar"
            >
              <AppText variant="bodyMd" color={colors.textSecondary}>✕</AppText>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : onReset ? (
              <View style={styles.btnRow}>
                <Button label="Guardar" onPress={onSave} variant="primary" size="sm" fullWidth={false} style={styles.btn} />
                <Button label="Resetar" onPress={onReset} variant="outline" size="sm" fullWidth={false} style={styles.btn} />
              </View>
            ) : (
              <Button label="Guardar" onPress={onSave} variant="primary" size="sm" />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
  card: {
    width: '100%',
    borderRadius: borderRadius['2xl'],
    maxHeight: '88%',
    overflow: 'hidden',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    flex: 1,
    marginRight: spacing[2],
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    gap: spacing[3],
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  btn: {
    flex: 1,
  },
});
