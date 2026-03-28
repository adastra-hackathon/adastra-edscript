import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { useAppTheme } from '../../../core/hooks/useAppTheme';
import { borderRadius, spacing } from '../../../core/theme';
import type { Banner } from '../types/home.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 180;
const BANNER_MARGIN = spacing[5];
const BANNER_WIDTH = SCREEN_WIDTH - BANNER_MARGIN * 2;

interface Props {
  banners: Banner[];
  onPress?: (banner: Banner) => void;
}

export const BannerCarousel = memo(function BannerCarousel({ banners, onPress }: Props) {
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    scrollRef.current?.scrollTo({
      x: index * (BANNER_WIDTH + spacing[3]),
      animated: true,
    });
  }, []);

  // Auto-scroll every 4s
  useEffect(() => {
    if (banners.length <= 1) return;
    autoScrollRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        scrollToIndex(next);
        return next;
      });
    }, 4000);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [banners.length, scrollToIndex]);

  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / (BANNER_WIDTH + spacing[3]));
      setActiveIndex(Math.min(Math.max(index, 0), banners.length - 1));
    },
    [banners.length]
  );

  if (banners.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={BANNER_WIDTH + spacing[3]}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={styles.bannerWrapper}
            onPress={() => onPress?.(banner)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: banner.mobileImageUrl ?? banner.imageUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {(banner.title || banner.subtitle) && (
              <View style={[styles.textOverlay, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
                {banner.title && (
                  <AppText variant="h3" color="#fff" numberOfLines={1}>
                    {banner.title}
                  </AppText>
                )}
                {banner.subtitle && (
                  <AppText variant="caption" color="rgba(255,255,255,0.85)" numberOfLines={1}>
                    {banner.subtitle}
                  </AppText>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dots indicator */}
      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setActiveIndex(i);
                scrollToIndex(i);
              }}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex ? colors.secondary : `${colors.secondary}44`,
                  width: i === activeIndex ? 16 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  scrollContent: {
    paddingHorizontal: BANNER_MARGIN,
    gap: spacing[3],
  },
  bannerWrapper: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[3],
    gap: spacing[0.5],
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingHorizontal: BANNER_MARGIN,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
