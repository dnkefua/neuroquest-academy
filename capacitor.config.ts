import type { CapacitorConfig } from '@capacitor/cli';

const liveServerUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID ?? 'com.ndnanalytics.neuroquest',
  appName: process.env.CAPACITOR_APP_NAME ?? 'NeuroQuest Academy',
  webDir: 'out',
  server: liveServerUrl
    ? {
        url: liveServerUrl,
        cleartext: false,
      }
    : {
        androidScheme: 'https',
      },
};

export default config;
