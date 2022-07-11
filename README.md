Get Expo project set up

```
expo init xxxx
cd xxxx
expo install expo-auth-session expo-random expo-application expo-web-browser
eas build:configure
eas build
eas credentials
```

Configure Firebase/Google Cloud

1. Create a project in Google Cloud
2. Go to IAM - Credentials and Configure the Consent Screen.
   1. Don't name the app with Google in the name or it won't save
   2. Add the email/user.profile scopes
   3. Add yourself as test user
3. Setup a Firebase project based on Gloud project
4. Add Apps outlined in : https://docs.expo.dev/guides/authentication/#google
   1. expoClientId: Proxy client ID for use in the Expo Go on iOS and Android.
   2. iosClientId: iOS native client ID for use in standalone and bare workflow.
   3. androidClientId: Android native client ID for use in standalone, bare workflow.
   4. webClientId: Expo web client ID for use in the browser.

Setup Secrets on Expo/Local

1. Create environment variables for Android, iOS, and expo, and put in the actual id's created in previous step, run these in Terminal to set locally

```
export GOOGLE_ANDROID_CLIENT_ID=""
export GOOGLE_IOS_CLIENT_ID=""
export GOOGLE_EXPO_CLIENT_ID=""
```

2. Add secrets to Expo build environment https://docs.expo.dev/build-reference/variables/#adding-secrets-with-eas-cli

```
eas secret:create
```

3. In eas.json add env variable to describe which environment you are using

```
{
  "cli": {
    "version": ">= 0.54.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

4. Create a app.config.js file to dynamically inject environment variables into system extra key

```
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
```

5. In Code you can access with Constants.manifest.extra

```
import Constants from "expo-constants";
export default function App() {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();
  const [_request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Constants.manifest.extra.androidClientId,
    iosClientId: Constants.manifest.extra.iosClientId,
    expoClientId: Constants.manifest.extra.expoClientId,
    scopes: ["profile", "email"],
  });
```
