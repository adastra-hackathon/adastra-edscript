import React, { memo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { WalletIcon } from '../icons';
import { borderRadius, spacing, getLevelColors } from '../../core/theme';

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatBalance(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export interface MenuUser {
  name: string;
  email: string;
  avatar?: string;
  level?: string;
  balance?: number;
}

interface Props {
  user: MenuUser;
  onDepositPress?: () => void;
}

export const UserCard = memo(function UserCard({ user = {name: 'João Silva', level: 'bronze', email: 'joao.silva@example.com', avatar: undefined, balance: 1234.56}, onDepositPress }: Props) {
  const { colors } = useAppTheme();
  const levelTheme = user.level ? getLevelColors(user.level) : getLevelColors('bronze');

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={[styles.avatarWrapper, { borderColor: levelTheme.primary }]}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarCircle, { backgroundColor: colors.backgroundQuaternary }]}>
            <AppText variant="h2" style={{ color: levelTheme.primary, }}>
              {user.name ? getInitials(user.name) : '?'}
            </AppText>
          </View>
        )}
        {user.level && (
          <View style={[styles.levelBadge, { backgroundColor: levelTheme.secondary, borderColor: levelTheme.primary }]}>
            <AppText variant="caption" style={{ color: levelTheme.primary, fontSize: 8, lineHeight: 9, fontWeight: 'bold' }}>
              {user.level}
            </AppText>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <AppText variant="labelLg" color={colors.textPrimary} numberOfLines={1}>
          {user.name}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {user.email}
        </AppText>
        {user.balance !== undefined && (
          <View style={styles.balanceRow}>
            <WalletIcon size={14} color={colors.secondary} />
            <AppText variant="labelMd" color={colors.secondary}>
              {formatBalance(user.balance)}
            </AppText>
          </View>
        )}
      </View>

      {/* Depositar */}
      <TouchableOpacity
        onPress={onDepositPress}
        style={[styles.depositBtn, { backgroundColor: colors.secondary }]}
        activeOpacity={0.8}
      >
        <AppText variant="buttonSm" style={{ color: colors.textOnSecondary }}>
          Depositar
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  avatarWrapper: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.full,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    paddingHorizontal: spacing[1.5],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    gap: spacing[0.5],
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[0.5],
  },
  depositBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    flexShrink: 0,
  },
});
