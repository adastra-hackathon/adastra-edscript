import React, { memo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { spacing } from '../../../core/theme';
import { ResponsibleGamingLimitCard } from './ResponsibleGamingLimitCard';
import { BettingLimitModal } from './BettingLimitModal';
import { DepositLimitModal } from './DepositLimitModal';
import { SessionTimeLimitModal } from './SessionTimeLimitModal';
import { TimedSelfExclusionModal } from './TimedSelfExclusionModal';
import { SelfExclusionModal } from './SelfExclusionModal';
import { responsibleGamingMapper } from '../mappers/responsibleGamingMapper';
import type { ResponsibleGamingState } from '../types/responsibleGaming.types';

type ModalKey = 'bet' | 'deposit' | 'sessionTime' | 'timedExclusion' | 'selfExclusion' | null;

interface Props {
  state: ResponsibleGamingState;
  onWithdrawPress: () => void;
}

export const ResponsibleGamingLimitsSection = memo(function ResponsibleGamingLimitsSection({
  state,
  onWithdrawPress,
}: Props) {
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const cards = responsibleGamingMapper.formatStateForCards(state);

  const close = () => setOpenModal(null);

  return (
    <>
      {/* Limites de jogo responsável */}
      <View style={styles.section}>
        <AppText variant="h3" style={styles.sectionTitle}>Limites de jogo responsável</AppText>

        <View style={styles.cards}>
          <ResponsibleGamingLimitCard
            title="Limite de aposta"
            rows={[
              { label: 'Diário', value: cards.betLimit?.daily ?? null },
              { label: 'Semanal', value: cards.betLimit?.weekly ?? null },
              { label: 'Mensal', value: cards.betLimit?.monthly ?? null },
            ]}
            onPress={() => setOpenModal('bet')}
          />
          <ResponsibleGamingLimitCard
            title="Limite de depósito"
            rows={[
              { label: 'Diário', value: cards.depositLimit?.daily ?? null },
              { label: 'Semanal', value: cards.depositLimit?.weekly ?? null },
              { label: 'Mensal', value: cards.depositLimit?.monthly ?? null },
            ]}
            onPress={() => setOpenModal('deposit')}
          />
          <ResponsibleGamingLimitCard
            title="Limite de tempo no site (min)"
            rows={[
              { label: 'Diário', value: cards.sessionTimeLimit?.daily ?? null },
              { label: 'Semanal', value: cards.sessionTimeLimit?.weekly ?? null },
              { label: 'Mensal', value: cards.sessionTimeLimit?.monthly ?? null },
            ]}
            onPress={() => setOpenModal('sessionTime')}
          />
        </View>
      </View>

      {/* Exclusão */}
      <View style={styles.section}>
        <AppText variant="h3" style={styles.sectionTitle}>Exclusão</AppText>

        <View style={styles.cards}>
          <ResponsibleGamingLimitCard
            title="Exclusão por tempo determinado"
            rows={[]}
            onPress={() => setOpenModal('timedExclusion')}
          />
          <ResponsibleGamingLimitCard
            title="Auto Exclusão"
            rows={[]}
            buttonLabel="Excluir"
            buttonVariant="danger"
            onPress={() => setOpenModal('selfExclusion')}
          />
        </View>
      </View>

      {/* Modals */}
      <BettingLimitModal
        visible={openModal === 'bet'}
        current={state.betLimit}
        onClose={close}
      />
      <DepositLimitModal
        visible={openModal === 'deposit'}
        current={state.depositLimit}
        onClose={close}
      />
      <SessionTimeLimitModal
        visible={openModal === 'sessionTime'}
        current={state.sessionTimeLimit}
        onClose={close}
      />
      <TimedSelfExclusionModal
        visible={openModal === 'timedExclusion'}
        current={state.selfExclusion}
        onClose={close}
      />
      <SelfExclusionModal
        visible={openModal === 'selfExclusion'}
        current={state.selfExclusion}
        onClose={close}
        onWithdrawPress={() => { close(); onWithdrawPress(); }}
      />
    </>
  );
});

const styles = StyleSheet.create({
  section: {
    gap: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[1],
  },
  cards: {
    gap: spacing[3],
  },
});
