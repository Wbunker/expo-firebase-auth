// expo install expo-web-browser expo-auth-session expo-random
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";
import * as Google from "expo-auth-session/providers/google";
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

  React.useEffect(() => {
    if (response) {
      setMessage(JSON.stringify(response));
      if (response?.type === "success") {
        setAccessToken(response.authentication.accessToken);
      }
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    userInfoResponse.json().then((data) => {
      setUserInfo(data);
    });
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      {showUserInfo()}
      <Button
        title={accessToken ? "Get User Data" : "Login"}
        onPress={
          accessToken
            ? getUserData
            : () => {
                promptAsync();
              }
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
