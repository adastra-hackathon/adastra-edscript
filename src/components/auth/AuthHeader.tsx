import React, { memo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { Button } from "../ui";
import { ChevronLeftIcon } from '../icons';
import { spacing, borderRadius, fontWeight } from '../../core/theme';

interface Props {
  onBack?: () => void;
  secondaryAction?: {
    label: string;
    button: string;
    onPress: () => void;
  };
}

const logo2 = require('../../assets/images/logos/logo2.png');
const logo3 = require('../../assets/images/logos/logo3.png');

export const AuthHeader = memo(function AuthHeader({ onBack, secondaryAction }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Top row: back button + secondary action */}
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backBtn, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}

        {secondaryAction && (
          <View style={styles.shortCutAction}>
            <AppText variant="labelMd" color={colors.textPrimary}>
              {secondaryAction.label}
            </AppText>
            <Button
              label={secondaryAction.button}
              onPress={secondaryAction.onPress}
              variant="secondary"
              textStyle={{ fontWeight: fontWeight.bold }}
              size="xs"
              fullWidth={false}
              style={{
                borderRadius: borderRadius["3xl"],
              }}
            />
          </View>
        )}
      </View>

      {/* Logos */}
      <View style={styles.logoContainer}>
        <Image
          source={logo2}
          style={styles.logoMain}
          resizeMode="contain"
        />
        <Image
          source={logo3}
          style={styles.logoSub}
          resizeMode="contain"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[2],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortCutAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  logoMain: {
    width: 200,
    height: 80,
  },
  logoSub: {
    width: 160,
    height: 32,
  },
});
