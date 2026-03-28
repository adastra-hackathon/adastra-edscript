import React, { memo } from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { spacing, borderRadius } from '../../../core/theme';

interface ResponsibleGamingModalProps {
  visible: boolean;
  onConfirm: () => void;
}

export const ResponsibleGamingModal = memo(function ResponsibleGamingModal({
  visible,
  onConfirm,
}: ResponsibleGamingModalProps) {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* +18 badge */}
            <View style={[styles.badge, { borderColor: colors.textPrimary }]}>
              <AppText variant="h2" color={colors.textPrimary} align="center">
                18+
              </AppText>
            </View>

            {/* Título */}
            <View style={styles.titleRow}>
              <AppText variant="h3" color={colors.warning}>
                ⚠ Jogue com Responsabilidade!
              </AppText>
            </View>

            {/* Texto institucional */}
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.paragraph}>
              esportesdasorte.bet.br é operado pela empresa ESPORTES GAMING BRASIL LTDA. (CNPJ nº 56.075.466/0001-00), entidade devidamente autorizada pela Secretaria de Prêmios e Apostas (Ministério da Fazenda), através da Portaria SPA/MF nº 136, de 23 de Janeiro de 2025. A plataforma detém a certificação GLI Brasil, emitida pela Gaming Laboratories International (GLI).
            </AppText>

            {/* Destaque Bolsa Família */}
            <AppText variant="bodySm" color={colors.warning} style={styles.paragraph}>
              Não é permitido o uso de recursos de programas sociais como o Bolsa Família e o LOAS.
            </AppText>

            {/* Aviso saúde */}
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.paragraph}>
              Atenção: Jogos de aposta podem causar dependência patológica (ludopatia), transtornos de ansiedade, depressão e levar ao superendividamento. Jogue com responsabilidade. Proibido para menores de 18 anos.
            </AppText>
          </ScrollView>

          {/* Botão Fechar */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              label="Fechar"
              onPress={onConfirm}
              variant="secondary"
              fullWidth
            />

            {/* Cookie notice */}
            <View style={styles.cookieRow}>
              <AppText variant="caption" color={colors.textTertiary} align="center">
                ✓ Ao utilizar nossos serviços, você aceita o uso de cookies.
              </AppText>
            </View>
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
    maxHeight: '85%',
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
    gap: spacing[4],
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    marginTop: spacing[1],
  },
  paragraph: {
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[5],
    borderTopWidth: 1,
    gap: spacing[3],
  },
  cookieRow: {
    paddingHorizontal: spacing[2],
  },
});
