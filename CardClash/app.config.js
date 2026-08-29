const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    if (!line || line.trim().startsWith('#')) continue;
    const match = line.match(/^([^=]+)=(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const rawBundleId = 'space.manus.card.battle.game.t20260128033823';
const bundleId = rawBundleId
  .replace(/[-_]/g, '.')
  .replace(/[^a-zA-Z0-9.]/g, '')
  .replace(/\.+/g, '.')
  .replace(/^\.+|\.+$/g, '')
  .toLowerCase()
  .split('.')
  .map((segment) => (/^[a-zA-Z]/.test(segment) ? segment : `x${segment}`))
  .join('.') || 'space.manus.app';

const timestamp = bundleId.split('.').pop().replace(/^t/, '');
const schemeFromBundleId = `manus${timestamp}`;
const buildVariant = process.env.APP_VARIANT === 'developer' ? 'developer' : 'player';
const isDeveloperBuild = buildVariant === 'developer';

module.exports = {
  name: isDeveloperBuild ? 'Card Clash Dev' : 'Card Clash',
  slug: isDeveloperBuild ? 'card-battle-game-dev' : 'card-battle-game',
  version: '1.0.7',
  orientation: 'default',
  icon: './assets/images/icon.png',
  scheme: isDeveloperBuild ? `${schemeFromBundleId}dev` : schemeFromBundleId,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: isDeveloperBuild ? `${bundleId}.dev` : bundleId,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocalNetworkUsageDescription: 'يستخدم Card Battle الشبكة المحلية لاكتشاف غرف اللعب القريبة والاتصال بها عبر Wi‑Fi.',
      NSBonjourServices: ['_cardclash._tcp.'],
    },
  },
  android: {
    versionCode: 23,
    adaptiveIcon: {
      backgroundColor: '#1a1a2e',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: isDeveloperBuild ? `${bundleId}.dev` : bundleId,
    permissions: [
      'POST_NOTIFICATIONS',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_WIFI_STATE',
      'android.permission.CHANGE_WIFI_MULTICAST_STATE',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [{ scheme: isDeveloperBuild ? `${schemeFromBundleId}dev` : schemeFromBundleId, host: '*' }],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-asset',
    ['expo-screen-orientation', { initialOrientation: 'DEFAULT' }],
    ['expo-audio', { microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.' }],
    ['expo-video', { supportsBackgroundPlayback: false, supportsPictureInPicture: false }],
    'expo-web-browser',
    ['expo-splash-screen', {
      image: './assets/images/splash-icon.png',
      imageWidth: 200,
      resizeMode: 'contain',
      backgroundColor: '#160816',
      dark: { backgroundColor: '#0f0f1a' },
    }],
    ['expo-build-properties', { android: { buildArchs: ['armeabi-v7a', 'arm64-v8a'], minSdkVersion: 24 } }],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
  extra: {
    buildVariant,
    diagnosticsEnabled: isDeveloperBuild,
    eas: { projectId: 'a41957f7-fc41-4caf-86e6-074b5eed2d49' },
  },
};
