import React, { memo, useState, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useResponsibleGaming } from '../hooks/useResponsibleGaming';
import { postLoginSignal } from '../postLoginSignal';
import { ResponsibleGamingModal } from './ResponsibleGamingModal';

const POST_LOGIN_DELAY_MS = 600;

export const ResponsibleGamingGate = memo(function ResponsibleGamingGate() {
  const { shouldShow, confirmRead } = useResponsibleGaming();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);

  // Exibição imediata (app abre deslogado, sessão persistida)
  useEffect(() => {
    if (shouldShow && isFocused) {
      setVisible(true);
    }
  }, [shouldShow, isFocused]);

  // Exibição pós login/cadastro: 1s após home focar, via sinal explícito
  useEffect(() => {
    if (!isFocused) return;
    if (!postLoginSignal.consume()) return;

    const timer = setTimeout(() => setVisible(true), POST_LOGIN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isFocused]);

  const handleConfirm = useCallback(() => {
    confirmRead();
    setVisible(false);
  }, [confirmRead]);

  return <ResponsibleGamingModal visible={visible} onConfirm={handleConfirm} />;
});
