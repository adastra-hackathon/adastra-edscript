import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { AppText } from '../../../components/ui/AppText';

export const TournamentsScreen = memo(function TournamentsScreen() {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.center}><AppText variant="h2">Tournaments</AppText></View>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({ safe: { flex: 1 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
