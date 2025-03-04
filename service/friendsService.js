import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = 'http://localhost:8080';

// fetch xbox friends - 

export const fetchXboxFriends = async () =>{
    // uhs and token - 
    const uhs = await AsyncStorage.getItem("uhs");
    const XSTS_token = await AsyncStorage.getItem("XSTS_token");
    console.log("XBOX FRIENDS FETCH tokens - UHS:", uhs, "XSTS_token:", XSTS_token);

    if (!uhs || !XSTS_token) {
        Alert.alert("Error", "Xbox authentication tokens missing. Please log in again.");
        throw new Error("Xbox authentication tokens missing.");
    }

    try{
        const response = await fetch(`${apiUrl}/api/xbox/friends/top-ten`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `XBL3.0 x=${uhs};${XSTS_token}`,
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch Xbox friends. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.people || [];
    }catch(error){
        console.error(error);
        Alert.alert("Error", "Failed to fetch Xbox friends.");
        throw error;
    }
};