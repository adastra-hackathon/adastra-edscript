import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../core/hooks/useAppTheme';
import { AppText } from '../ui/AppText';
import { Divider } from '../ui/Divider';
import { UserCard, type MenuUser } from './UserCard';
import { MenuItem, type MenuItemConfig } from './MenuItem';
import { LogoutButton } from './LogoutButton';
import { borderRadius, spacing } from '../../core/theme';
import { MenuIcon } from "../icons";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user?: MenuUser;
  onDepositPress?: () => void;
  menuItems: MenuItemConfig[];
  footerItems?: MenuItemConfig[];
  onLogoutPress?: () => void;
}

export const SideMenu = memo(function SideMenu({
  visible,
  onClose,
  isAuthenticated,
  user,
  onDepositPress,
  menuItems,
  onLogoutPress,
}: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(false);
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, translateX, overlayOpacity]);

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + spacing[2],
            paddingBottom: Math.max(insets.bottom, spacing[4]),
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MenuIcon size={20} color={colors.secondary} />
            <AppText variant="h2" color={colors.textPrimary}>
              Menu
            </AppText>
          </View>
          <View style={styles.headerLeft} />          
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <AppText variant="labelLg" color={colors.textSecondary}>✕</AppText>
          </TouchableOpacity>
        </View>

        
              <Divider marginHorizontal={0}/>

        {/* ScrollView content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* UserCard — só se autenticado */}
          {isAuthenticated && user && (
            <>
              <UserCard user={user} onDepositPress={onDepositPress} />
            </>
          )}

          {/* Menu items */}
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (

              <View key={index}>
                <MenuItem {...item} />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer — logout */}
        {isAuthenticated && onLogoutPress && (
          <>
            <Divider />
            <View style={styles.footer}>
              <LogoutButton onPress={onLogoutPress} />
            </View>
          </>
        )}
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  menuList: {
    marginTop: spacing[3],
    gap: spacing[1],
  },
  footer: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
  },
});
