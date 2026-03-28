import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { formatCurrency } from '../utils/gameRoomCalculations';
import type { GameRoomVoucher } from '../types/game-room.types';

interface Props {
  voucher: GameRoomVoucher;
}

export function VoucherCard({ voucher }: Props) {
  const { colors } = useAppTheme();

  const expiry = new Date(voucher.expiresAt).toLocaleDateString('pt-BR');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: '#FBBF24' }]}>
      <AppText style={[styles.title, { color: '#FBBF24' }]}>🎟 Voucher de Consolação</AppText>
      <AppText style={[styles.amount, { color: colors.textPrimary }]}>
        Entrada grátis de {formatCurrency(voucher.amount)}
      </AppText>
      <AppText style={[styles.expiry, { color: colors.textSecondary }]}>
        Válido para próxima sala do mesmo valor • Expira em {expiry}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  title: { fontSize: 13, fontFamily: 'Inter-SemiBold', marginBottom: 6 },
  amount: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 4 },
  expiry: { fontSize: 12, fontFamily: 'Inter-Regular' },
});
