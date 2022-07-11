let Config = {
  androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  expoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
};

// Change this to different environment variables for different environments.
if (process.env.APP_ENV === "production") {
  Config.androidClientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
  Config.iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;
  Config.expoClientId = process.env.GOOGLE_EXPO_CLIENT_ID;
} else if (process.env.APP_ENV === "staging") {
  Config.androidClientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
  Config.iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;
  Config.expoClientId = process.env.GOOGLE_EXPO_CLIENT_ID;
}

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...Config,
    },
  };
};
