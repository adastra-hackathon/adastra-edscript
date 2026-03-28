import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { useStartup } from '../../hooks/useStartup';

export function StartupScreen() {
  const { colors } = useAppTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useStartup();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../../assets/branding/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        style={styles.indicator}
        color={colors.secondary}
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 80,
  },
  indicator: {
    marginTop: 40,
  },
});
