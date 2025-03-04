import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = "http://localhost:8080";

// Fetch Xbox profile
export const fetchXboxProfile = async () => {
  // Use AsyncStorage to get tokens instead of localStorage
  const jwtToken = await AsyncStorage.getItem("jwtToken");
  const uhs = await AsyncStorage.getItem("uhs");
  const XSTS_token = await AsyncStorage.getItem("XSTS_token");

  // Debugging: Log the retrieved tokens
  console.log("Fetched tokens - UHS:", uhs, "XSTS_token:", XSTS_token);

  if (!uhs || !XSTS_token) {
    Alert.alert("Error", "Xbox authentication tokens missing. Please log in again.");
    throw new Error("Xbox authentication tokens missing.");
  }

  try {
    const response = await fetch(`${apiUrl}/api/xbox/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Depending on your API, you may need to combine these into a single header.
        Authorization: `XBL3.0 x=${uhs};${XSTS_token}`,
        "Authorization": "Bearer " + jwtToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Xbox profile. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to fetch Xbox profile.");
    throw error;
  }
};

// Fetch PSN profile
export const fetchPSNProfile = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/psn/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PSN profile. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to fetch PSN profile.");
    throw error;
  }
};

// Fetch Steam profile
export const fetchSteamProfile = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/steam/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Steam profile. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to fetch Steam profile.");
    throw error;
  }
};
