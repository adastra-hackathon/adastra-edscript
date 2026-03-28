import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useAppTheme } from '../../../../core/hooks/useAppTheme';
import { AppText } from '../../../../components/ui/AppText';
import { borderRadius, spacing } from '../../../../core/theme';
import type { ProfileMenuViewModel } from '../../types/profile.types';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.88;

interface Props {
  visible: boolean;
  viewModel: ProfileMenuViewModel | null;
  onClose: () => void;
  onDepositPress: () => void;
  onProfilePress: () => void;
  onLogoutPress: () => void;
}

export const ProfileModal = memo(function ProfileModal({
  visible,
  viewModel,
  onClose,
  onDepositPress,
  onProfilePress,
  onLogoutPress,
}: Props) {
  const { colors } = useAppTheme();
  const translateY = useRef(new Animated.Value(SHEET_MAX_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 220 }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [translateY, opacity]);

  const animateOut = useCallback((cb?: () => void) => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: SHEET_MAX_HEIGHT, useNativeDriver: true, damping: 22, stiffness: 220 }),
      Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
    ]).start(cb);
  }, [translateY, opacity]);

  useEffect(() => {
    if (visible) {
      translateY.setValue(SHEET_MAX_HEIGHT);
      opacity.setValue(0);
      animateIn();
    }
  }, [visible, animateIn, translateY, opacity]);

  const handleClose = useCallback(() => {
    animateOut(onClose);
  }, [animateOut, onClose]);

  const handleDeposit = useCallback(() => {
    handleClose();
    setTimeout(onDepositPress, 160);
  }, [handleClose, onDepositPress]);

  const handleProfile = useCallback(() => {
    handleClose();
    setTimeout(onProfilePress, 160);
  }, [handleClose, onProfilePress]);

  const handleLogout = useCallback(() => {
    handleClose();
    setTimeout(onLogoutPress, 160);
  }, [handleClose, onLogoutPress]);

  if (!viewModel) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { backgroundColor: colors.overlay, opacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} accessibilityLabel="Fechar menu" />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { backgroundColor: colors.background, transform: [{ translateY }] }]}
      >
        {/* Drag handle */}
        <View style={styles.handleWrap}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* User header row */}
          <TouchableOpacity
            onPress={handleProfile}
            activeOpacity={0.8}
            style={[styles.userRow, { borderBottomColor: colors.border }]}
          >
            {/* Avatar */}
            {viewModel.avatarUrl ? (
              <Image source={{ uri: viewModel.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { borderColor: colors.secondary }]}>
                <AppText variant="h3" color={colors.secondary}>{viewModel.initials}</AppText>
                <View style={[styles.levelBadge, { borderColor: colors.warning }]}>
                  <AppText variant="caption" color={colors.warning}>{viewModel.levelLabel}</AppText>
                </View>
              </View>
            )}

            {/* Info */}
            <View style={styles.userInfo}>
              <AppText variant="labelLg" color={colors.textPrimary} numberOfLines={1}>
                {viewModel.fullName}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                {viewModel.email}
              </AppText>
              <AppText variant="caption" color={colors.secondary}>
                💰 {viewModel.balanceFormatted}
              </AppText>
            </View>

            {/* Arrow */}
            <View style={[styles.arrowBtn, { backgroundColor: colors.surface }]}>
              <AppText variant="bodyMd" color={colors.textSecondary}>›</AppText>
            </View>
          </TouchableOpacity>

          {/* Deposit CTA */}
          <TouchableOpacity
            onPress={handleDeposit}
            activeOpacity={0.85}
            style={[styles.depositBtn, { backgroundColor: colors.secondary }]}
          >
            <AppText variant="h3" color={colors.textOnSecondary}>⊕ Depositar</AppText>
            <AppText variant="caption" color={colors.textOnSecondary} style={styles.depositSub}>
              Transferência, PIX, Cartão
            </AppText>
          </TouchableOpacity>

          {/* Menu items */}
          <View style={[styles.menuList, { borderTopColor: colors.border }]}>
            {viewModel.actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => { handleClose(); setTimeout(action.onPress, 160); }}
                activeOpacity={0.7}
                style={[styles.menuItem, { borderBottomColor: colors.border }]}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.surface }]}>
                  {action.icon}
                </View>
                <AppText variant="bodyMd" color={colors.textPrimary} style={styles.menuLabel}>
                  {action.label}
                </AppText>
                <AppText variant="bodyMd" color={colors.textTertiary}>›</AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={[styles.logoutBtn, { backgroundColor: colors.errorBackground }]}
          >
            <AppText variant="labelMd" color={colors.error}>↪ Sair da conta</AppText>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: SHEET_MAX_HEIGHT,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: spacing[3],
    paddingBottom: spacing[1],
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[1],
  },
  userInfo: {
    flex: 1,
    gap: spacing[0.5],
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositBtn: {
    marginHorizontal: spacing[5],
    marginVertical: spacing[3],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    alignItems: 'center',
    gap: spacing[0.5],
  },
  depositSub: {
    opacity: 0.8,
  },
  menuList: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
  },
  logoutBtn: {
    marginHorizontal: spacing[5],
    marginVertical: spacing[4],
    marginBottom: spacing[8],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
