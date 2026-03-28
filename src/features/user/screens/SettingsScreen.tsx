import React, { memo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { spacing, borderRadius } from '../../../core/theme';
import { useProtectedRoute } from '../../../core/hooks/useProtectedRoute';
import { BellIcon, GearIcon, HistoryIcon, HeadsetIcon, WalletIcon } from '../../../components/icons';
import { SettingsSection } from '../../settings/components/SettingsSection';
import { SettingsItem, SettingsIconBox, ItemDivider, SettingsSubLabel } from '../../settings/components/SettingsItem';
import { SettingsToggleItem } from '../../settings/components/SettingsToggleItem';
import { useSettings } from '../../settings/hooks/useSettings';
import type { AppStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export const SettingsScreen = memo(function SettingsScreen() {
  const { colors } = useAppTheme();
  const navigation = useNavigation<Nav>();

  const { isAuthenticated } = useProtectedRoute({
    pendingRoute: { stack: 'App', screen: 'Settings' },
  });

  const {
    settings,
    updateNotifications,
    updateSecurity,
    updateDisplay,
    isSaving,
    hasChanges,
    saveSettings,
  } = useSettings();

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} accessibilityLabel="Voltar">
          <AppText variant="h3" color={colors.textSecondary}>{'‹'}</AppText>
        </TouchableOpacity>
        <AppText variant="h3" color={colors.textPrimary} style={styles.headerTitle}>
          Configurações
        </AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Perfil & Idioma ──────────────────────────── */}
        <SettingsSection title="PERFIL & IDIOMA">
          <SettingsItem
            icon={<SettingsIconBox color="#3b82f6"><AppText style={styles.emoji}>👤</AppText></SettingsIconBox>}
            label="Editar Perfil"
            onPress={() => navigation.navigate('Account')}
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#8b5cf6"><AppText style={styles.emoji}>🌐</AppText></SettingsIconBox>}
            label="Idioma"
            value="Português"
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#ef4444"><BellIcon size={16} color="#fff" /></SettingsIconBox>}
            label="Notificações"
            onPress={() => navigation.navigate('Notifications')}
          />
        </SettingsSection>

        {/* ── Notificações ─────────────────────────────── */}
        <SettingsSection title="NOTIFICAÇÕES">
          <SettingsSubLabel label="PUSH / APP" />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#3b82f6"><AppText style={styles.emoji}>📱</AppText></SettingsIconBox>}
            label="Novidades e promoções"
            value={settings.notifications.pushPromotions}
            onToggle={v => updateNotifications('pushPromotions', v)}
          />
          <ItemDivider />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#f59e0b"><AppText style={styles.emoji}>⚡</AppText></SettingsIconBox>}
            label="Alertas de resultados"
            value={settings.notifications.pushResultAlerts}
            onToggle={v => updateNotifications('pushResultAlerts', v)}
          />
          <ItemDivider />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#ec4899"><AppText style={styles.emoji}>🎰</AppText></SettingsIconBox>}
            label="Lembretes de apostas / jackpots"
            value={settings.notifications.pushReminders}
            onToggle={v => updateNotifications('pushReminders', v)}
          />

          <SettingsSubLabel label="E-MAIL" />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#10b981"><AppText style={styles.emoji}>✉️</AppText></SettingsIconBox>}
            label="Promoções e novidades"
            value={settings.notifications.emailPromotions}
            onToggle={v => updateNotifications('emailPromotions', v)}
          />
          <ItemDivider />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#6366f1"><AppText style={styles.emoji}>📋</AppText></SettingsIconBox>}
            label="Resumo semanal"
            value={settings.notifications.emailWeeklySummary}
            onToggle={v => updateNotifications('emailWeeklySummary', v)}
          />

          <SettingsSubLabel label="SMS" />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#64748b"><AppText style={styles.emoji}>💬</AppText></SettingsIconBox>}
            label="Notificações importantes"
            value={settings.notifications.smsImportant}
            onToggle={v => updateNotifications('smsImportant', v)}
          />
        </SettingsSection>

        {/* ── Preferências de Exibição ─────────────────── */}
        <SettingsSection title="PREFERÊNCIAS DE EXIBIÇÃO">
          <SettingsItem
            icon={<SettingsIconBox color="#0f172a"><AppText style={styles.emoji}>🌙</AppText></SettingsIconBox>}
            label="Tema"
            value="Escuro"
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#3b82f6"><AppText style={styles.emoji}>📋</AppText></SettingsIconBox>}
            label="Layout de histórico"
            value="Cards"
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#22c55e"><AppText style={styles.emoji}>💰</AppText></SettingsIconBox>}
            label="Moeda"
            value="R$ BRL"
          />
          <ItemDivider />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#f59e0b"><AppText style={styles.emoji}>💡</AppText></SettingsIconBox>}
            label="Mostrar dicas / tutorial"
            value={settings.display.showTips}
            onToggle={v => updateDisplay('showTips', v)}
          />
        </SettingsSection>

        {/* ── Segurança ────────────────────────────────── */}
        <SettingsSection title="SEGURANÇA">
          <SettingsToggleItem
            icon={<SettingsIconBox color="#ef4444"><AppText style={styles.emoji}>🔐</AppText></SettingsIconBox>}
            label="Autenticação 2FA"
            value={settings.security.twoFactorAuth}
            onToggle={v => updateSecurity('twoFactorAuth', v)}
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#f59e0b"><AppText style={styles.emoji}>❓</AppText></SettingsIconBox>}
            label="Perguntas de segurança"
            onPress={() => {}}
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#3b82f6"><AppText style={styles.emoji}>💻</AppText></SettingsIconBox>}
            label="Sessões ativas"
            onPress={() => {}}
          />
          <ItemDivider />
          <SettingsToggleItem
            icon={<SettingsIconBox color="#8b5cf6"><AppText style={styles.emoji}>👆</AppText></SettingsIconBox>}
            label="Bloqueio com biometria"
            value={settings.security.biometricLock}
            onToggle={v => updateSecurity('biometricLock', v)}
          />
        </SettingsSection>

        {/* ── Pagamentos & Carteira ────────────────────── */}
        <SettingsSection title="PAGAMENTOS & CARTEIRA">
          <SettingsItem
            icon={<SettingsIconBox color="#22c55e"><AppText style={styles.emoji}>💳</AppText></SettingsIconBox>}
            label="Métodos de pagamento"
            onPress={() => navigation.navigate('Wallet')}
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#f59e0b"><AppText style={styles.emoji}>⬇️</AppText></SettingsIconBox>}
            label="Limites de depósito / saque"
            onPress={() => {}}
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#3b82f6"><HistoryIcon size={16} color="#fff" /></SettingsIconBox>}
            label="Histórico de transações"
            rightElement={
              <TouchableOpacity
                onPress={() => navigation.navigate('Transactions')}
                style={[styles.verBtn, { borderColor: colors.secondary }]}
              >
                <AppText variant="caption" color={colors.secondary} style={styles.verText}>
                  Ver
                </AppText>
              </TouchableOpacity>
            }
            onPress={() => navigation.navigate('Transactions')}
          />
        </SettingsSection>

        {/* ── Ajuda & Suporte ──────────────────────────── */}
        <SettingsSection title="AJUDA & SUPORTE">
          <SettingsItem
            icon={<SettingsIconBox color="#3b82f6"><AppText style={styles.emoji}>❓</AppText></SettingsIconBox>}
            label="FAQ / Central de Ajuda"
            onPress={() => {}}
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#10b981"><HeadsetIcon size={16} color="#fff" /></SettingsIconBox>}
            label="Contatar atendimento"
            onPress={() => {}}
          />
          <ItemDivider />
          <SettingsItem
            icon={<SettingsIconBox color="#64748b"><AppText style={styles.emoji}>📄</AppText></SettingsIconBox>}
            label="Termos de uso / Privacidade"
            onPress={() => {}}
          />
        </SettingsSection>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Footer fixo — Salvar */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={saveSettings}
          disabled={!hasChanges || isSaving}
          style={[
            styles.saveBtn,
            {
              backgroundColor: hasChanges ? colors.secondary : colors.surface,
              borderColor: hasChanges ? colors.secondary : colors.border,
            },
          ]}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={hasChanges ? '#000' : colors.textTertiary} />
          ) : (
            <AppText
              variant="bodyMd"
              color={hasChanges ? '#000' : colors.textTertiary}
              style={styles.saveBtnText}
            >
              Salvar alterações
            </AppText>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { minWidth: 40 },
  headerTitle: { fontWeight: '700' },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    gap: spacing[5],
  },
  emoji: { fontSize: 15, lineHeight: 18 },
  verBtn: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  verText: { fontWeight: '600' },
  bottomPad: { height: spacing[4] },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  saveBtnText: { fontWeight: '700' },
});
