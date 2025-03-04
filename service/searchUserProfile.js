import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = 'http://localhost:8080';

export const searchUserProfile = async username => {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    if(jwtToken === null){
        console.error("User is not authenticated");
        return { success: false, message: "User is not authenticated" };
    }
    try {
        const response = await fetch(
            `${apiUrl}/api/search?username=${encodeURIComponent(username)}`,
            {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + jwtToken,
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to search user profile. Status: ${response.status}`);
        }
        const data = await response.json();
        const profile = data.profile;
        const recentGames = data.recentPlayedGames;
        return { success: true, profile, recentGames };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllLinkedProfiles = async () => {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    try {
        const response = await fetch(`${apiUrl}/api/search/all-linked-profiles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + jwtToken,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch all linked profiles. Status: ${response.status}`);
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

