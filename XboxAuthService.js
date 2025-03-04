import React, { useEffect } from "react";
import { View, Button } from "react-native";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const apiUrl = "http://localhost:8080";

export const exchangeCodeForTokens = async () => {
  try {
    // Get the URL that launched the app (deep link)
    const url = await Linking.getInitialURL();
    if (url) {
      const parsedUrl = new URL(url);
      const code = parsedUrl.searchParams.get("code");
      if (code) {
        try {
          const response = await fetch(
            `${apiUrl}/api/auth/callback?code=${code}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to retrieve tokens. Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Callback API JSON Response:", data);

          // Save tokens using AsyncStorage
          await AsyncStorage.setItem("uhs", data.uhs);
          await AsyncStorage.setItem("XSTS_token", data.xsts_token);

          Toast.show({
            type: "success",
            text1: "Xbox login successful!",
          });
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Error during Xbox login",
            text2: error.message,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error getting initial URL:", err);
  }
};

export const handleLogin = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to retrieve tokens. Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.redirectUrl) {
      // Open the URL in the user's browser
      Linking.openURL(data.redirectUrl);
    } else {
      Toast.show({
        type: "error",
        text1: "Error during Xbox login",
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Error during Xbox login",
      text2: error.message,
    });
  }
};

const XboxLogin = () => {
  useEffect(() => {
    exchangeCodeForTokens();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Login with Xbox" onPress={handleLogin} />
      <Toast />
    </View>
  );
};

export default XboxLogin;
