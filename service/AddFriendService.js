import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = 'http://localhost:8080';

export const addFriend = async (username) => {
    try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if (jwtToken === null) {
            console.error("User is not authenticated");
            return { success: false, message: "User is not authenticated" };
        }
        const response = await fetch(`${apiUrl}/api/friends/add?userNameOFRequest=${encodeURIComponent(username)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + jwtToken,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to add friend. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// check if user getting any notification regarding friend request  
export const checkFriendRequest = async () => {
    console.log("checkForPendingRequests has been called!"); // Add a debug log

    try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if (jwtToken === null) {
            console.error("User is not authenticated");
            return { success: false, message: "User is not authenticated" };
        }
        const response = await fetch(`${apiUrl}/api/friends/pending`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + jwtToken,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to check friend request. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// accept friend request - 

export const acceptFriendRequest = async (username) => {
    try{
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if(jwtToken === null){
            console.error("User is not authenticated");
            return {success: false, message: "User is not authenticated"};
        }
        const response = await fetch(`${apiUrl}/api/friends/accept?userNameOFRequest=${encodeURIComponent(username)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + jwtToken,
            },
        });
        if(!response.ok){
            throw new Error(`Failed to accept friend request. Status: ${response.status}`);
            return;
        }
        const data = await response.json();
        return data || [];
    }catch(error){
        console.error(error);
        throw error;
    }
};


// get all friends - 

export const getAllFriends = async () => {
    try{
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if(jwtToken === null){
            console.error("User is not authenticated");
            return {success: false, message: "User is not authenticated"};
        }
        const response = await fetch(`${apiUrl}/api/friends/get-all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + jwtToken,
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch all friends. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }catch(error){
        console.error(error);
        throw error;
    }
}