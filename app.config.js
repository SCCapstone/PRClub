export default {
  name: 'PRClub',
  slug: 'PRClub',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: [
    '**/*',
  ],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0d0908',
    },
    package: 'com.prclub',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    useEmulators: process.env.USE_EMULATORS === 'true',
  },
};
