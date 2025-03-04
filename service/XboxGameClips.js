import React, { useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = 'http://localhost:8080';

export const getGameClips = async() => {
    const uhs = await AsyncStorage.getItem("uhs");
    const XSTS_token = await AsyncStorage.getItem("XSTS_token");
    try{
        const response = await fetch(`${apiUrl}/api/xbox/gameclips`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `XBL3.0 x=${uhs};${XSTS_token}`,
            },
        });
        if(response.ok){
            const data = await response.json();
            return data.flatMap(item => item.gameClips) || []
        }
    }catch(error){
        console.error(error);
        Alert.alert("Error", "Failed to fetch Xbox game clips.");
        throw error;
    }
};