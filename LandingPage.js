// LandingPage.js (React Native)
import React, { useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleLogin, exchangeCodeForTokens } from "./XboxAuthService";

// store data = 
const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error("Error", e);
    }
};


const LandingPage = () => {
    const navigation = useNavigation();
    useEffect(() => {
    const checkForCode = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
        const queryString = initialUrl.includes('?') ? initialUrl.split('?')[1] : '';
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get("code")) {
            await exchangeCodeForTokens();
            await storeData("platform", "xbox"); // store user chosen platform
            // Reset the navigation stack so HomePage becomes the new root
            navigation.reset({ index: 0, routes: [{ name: 'HomePage' }] });
        }
        }
    };
    
    checkForCode();
    }, [navigation]);      

    const handlePlatformLogin = async (platform) => {
        if(platform === "xbox"){
            await handleLogin();
        }
    };  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to GamerHub</Text>
      <Text style={{ marginBottom: 20 }}>Select a platform to log in:</Text>
      <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 20 }}>
        <Button title="Xbox Login" onPress={() => handlePlatformLogin("xbox")} color="green" />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 10 }}>
        <Button title="PSN Login" onPress={() => handlePlatformLogin("psn")} color="blue" />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 10 }}>
        <Button title="Steam Login" onPress={() => handlePlatformLogin("steam")} color="gray" />
      </View>
    </View>
  );
};

export default LandingPage;
