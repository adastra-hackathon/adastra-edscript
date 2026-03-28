module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Path aliases — must match tsconfig.json paths
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/core': './src/core',
            '@/features': './src/features',
            '@/navigation': './src/navigation',
            '@/store': './src/store',
            '@/assets': './src/assets',
            '@/components': './src/components',
          },
        },
      ],
      // Reanimated plugin — habilitar apenas em builds nativos (não funciona no Expo Go)
      // 'react-native-reanimated/plugin',
    ],
  };
};
