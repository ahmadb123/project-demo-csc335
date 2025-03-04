const apiUrl = 'http://localhost:8080';

// fetch news- 

// recent news for the homepage - 
// add another api to filter news  - 
// recent news for specific genres, games, platforms.
export const fetchRecentNews = async () =>{
    try{
        const response = await fetch(`${apiUrl}/api/news/recent-news`, {
            method: "GET",
            headers : {
                "Content-Type": "application/json",
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch recent news. Status: ${response.status}`);
        }
        const data = await response.json();
        const flattened = data.flatMap(item => item.results || []);
        return flattened;   
    }catch(error){
        console.error(error);
        throw error;
    }
};

export const fetchAllNews = async (platform , genre) => {
    try{
        // include filter options - 
        let url = `${apiUrl}/api/news/all-news`;
        const params = new URLSearchParams();
        if (platform) params.append("platform", platform);
        if (genre) params.append("genre", genre);
        if (params.toString()) {
          url += "?" + params.toString();
        }
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch all news. Status: ${response.status}`);
        }
        const data = await response.json();
        const flattened = data.flatMap(item => item.results || []);
        return flattened;
    }catch(error){
        console.error(error);
        throw error;
    }
};

// get all genres - 

export const getGenres = async () => {
    try{
        const response = await fetch(`${apiUrl}/api/news/genres`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch genres. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }catch(error){
        console.error(error);
        throw error;
    }
};

export const searchForGame = async (searchGame) =>{
    try{
        const response = await fetch(`${apiUrl}/api/news/search-game?gameName=${searchGame}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch search results. Status: ${response.status}`);
        }
        const data = await response.json();
        const flattened = data.flatMap(item => item.results || []);
        return flattened;
    }catch(error){
        console.error(error);
        throw error;
    }
};