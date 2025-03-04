import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = 'http://localhost:8080';

// function to post news to the community insight
export const postNews = async (contentText, sharedNewsId, sharedClipsId = null) => {
  const token = await AsyncStorage.getItem("jwtToken"); // Get the JWT token from AsyncStorage

  if (!token) {
    console.error("User is not authenticated");
    return { success: false, message: "User is not authenticated" };
  }

  const postData = {
    contentText,
    sharedNewsId,
    sharedClipsId,
  };

  try {
    const response = await fetch(`${apiUrl}/api/community-insight/post-news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data }; // Return success and response data
    } else {
      const error = await response.text();
      console.error("Failed to share post. Status:", response.status, error);
      return { success: false, message: error };
    }
  } catch (error) {
    console.error("Error sharing post:", error);
    return { success: false, message: error.message };
  }
};

// function to get all news from the community insight

export const getAllNews = async () => {
  try{
    const response = await fetch(`${apiUrl}/api/community-insight/news/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.ok){
      const data = await response.json();
      return data;
    }else{
      const error = await response.text();
      console.error("Failed to fetch news. Status:", response.status, error);
      return { success: false, message: error };
    }
  }catch(error){
    console.error("Error fetching news:", error);
    return { success: false, message: error.message };
  }
};
