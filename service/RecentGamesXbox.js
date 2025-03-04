import React, { useEffect } from "react";
import { Alert } from "react-native";

const apiUrl = 'http://localhost:8080';

export const getRecentGames = async () => {
    const uhs = localStorage.getItem("uhs");
    const XSTS_token = localStorage.getItem("XSTS_token");
    const jwtToken = localStorage.getItem("jwtToken");
    if(jwtToken === null){
        console.error("User is not authenticated");
        return {success: false, message: "User is not authenticated"};
    }
    try{
        const response = await fetch(`${apiUrl}/api/xbox/recent-games`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `XBL3.0 x=${uhs};${XSTS_token}`,
                'Auth': 'Bearer ' + jwtToken,
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch Xbox recent games. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.titles || [];
    }catch(error){
        console.error(error);
        Alert.alert("Error", "Failed to fetch Xbox recent games.");
        throw error;
    }
};