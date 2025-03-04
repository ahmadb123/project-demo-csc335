// src/components/HomePage.js (React Native)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  fetchXboxProfile,
  fetchPSNProfile,
  fetchSteamProfile,
} from "./service/profileService";
import { fetchXboxFriends } from "./service/friendsService";
import { getRecentGames } from "./service/RecentGamesXbox";
import { fetchRecentNews } from "./service/NewsService";
import { postNews } from "./service/PostNewsService";
import { checkAccountType } from "./utility/CheckAccountType";  
import {
  searchUserProfile,
  getAllLinkedProfiles,
} from "./service/searchUserProfile";
import { addFriend } from "./service/AddFriendService";
import {
  checkFriendRequest,
  acceptFriendRequest,
  getAllFriends,
} from "./service/AddFriendService";

const HomePage = () => {
  const navigation = useNavigation();

  // State variables
  const [accountInfo, setAccountInfo] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Xbox friends (from Xbox Live)
  const [friends, setFriends] = useState([]);
  const [isFetchingFriends, setIsFetchingFriends] = useState(true);

  // Custom friend list (from your own backend)
  const [friendsList, setFriendsList] = useState([]);
  const [isFriendsDropdownOpen, setIsFriendsDropdownOpen] = useState(false);

  // Recent games (logged-in user)
  const [recentGames, setRecentGames] = useState([]);
  const [isFetchingRecentGames, setIsFetchingRecentGames] = useState(true);

  // News
  const [recentNews, setRecentNews] = useState([]);
  const [isFetchingRecentNews, setIsFetchingRecentNews] = useState(true);

  // Linked profiles
  const [linkedProfiles, setLinkedProfiles] = useState([]);
  const [showLinkedProfiles, setShowLinkedProfiles] = useState(false);

  // Pending friend requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showPendingList, setShowPendingList] = useState(false);

  // Searching & selected user
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [selectedUserGames, setSelectedUserGames] = useState([]);
  const [showMoreSelectedUserGames, setShowMoreSelectedUserGames] =
    useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedPlatform = await AsyncStorage.getItem("platform");
        if (!storedPlatform) {
          Alert.alert("Error", "No platform selected. Please log in again.");
          navigation.navigate("LoginPage");
          return;
        }
        setPlatform(storedPlatform);

        // Pick the right fetcher for the user’s profile(in the meantime only xbox available)
        const profileFetchers = {
          xbox: fetchXboxProfile,
          psn: fetchPSNProfile,
          steam: fetchSteamProfile,
        };
        const fetchProfile = profileFetchers[storedPlatform];
        if (!fetchProfile) {
          Alert.alert("Error", "Unsupported platform. Please log in again.");
          navigation.navigate("LoginPage");
          return;
        }

        // Fetch user’s main account
        const account = await fetchProfile();
        setAccountInfo(account);
        setIsFetching(false);

        if (storedPlatform === "xbox") {
          // Fetch official Xbox Live friends
          try {
            const fetchedFriends = await fetchXboxFriends();
            setFriends(fetchedFriends);
            setIsFetchingFriends(false);
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch Xbox friends.");
          }

          // Fetch linked profiles
          try {
            const linked = await getAllLinkedProfiles();
            setLinkedProfiles(linked);
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch linked profiles.");
          }
        }

        // Fetch recent games (logged-in user)
        try {
          const games = await getRecentGames();
          setRecentGames(games);
          setIsFetchingRecentGames(false);
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "Failed to fetch recent games.");
        }

        // Also fetch news, pending requests, custom friend list
        fetchNews();
        checkForPendingRequests();
        fetchFriendsList();
      } catch (error) {
        console.error(error);
        await AsyncStorage.removeItem("platform");
        Alert.alert("Error", "Failed to fetch profile information.");
        navigation.navigate("LoginPage");
      }
    };

    initialize();
  }, []);

  // Fetch news
  const fetchNews = async () => {
    setIsFetchingRecentNews(true);
    try {
      const news = await fetchRecentNews();
      setRecentNews(news);
      setIsFetchingRecentNews(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch recent news.");
      setIsFetchingRecentNews(false);
    }
  };

  // Check for pending friend requests
  const checkForPendingRequests = async () => {
    try {
      const pending = await checkFriendRequest();
      setPendingRequests(pending);
    } catch (err) {
      console.error("Failed to fetch pending friend requests:", err);
    }
  };

  const togglePendingList = () => {
    setShowPendingList(!showPendingList);
  };

  const handleAcceptBtn = async () => {
    if (pendingRequests.length > 0) {
      try {
        const username = pendingRequests[0].username;
        await acceptFriendRequest(username);
      } catch (err) {
        console.error("Failed to accept friend request:", err);
      }
    }
  };

  const fetchFriendsList = async () => {
    try {
      const list = await getAllFriends();
      setFriendsList(list);
    } catch (err) {
      console.error("Failed to fetch all friends list:", err);
    }
  };

  const toggleFriendsDropDown = async () => {
    if (!isFriendsDropdownOpen) {
      await fetchFriendsList();
    }
    setIsFriendsDropdownOpen(!isFriendsDropdownOpen);
  };

  const navigateToFriendPage = (friendId) => {
    navigation.navigate("User", { friendId });
  };

  // Linked profiles
  const toggleLinkedProfiles = () => {
    setShowLinkedProfiles(!showLinkedProfiles);
  };

  // Searching user
  const handleSearchChange = async (text) => {
    setSearchQuery(text);
    setSelectedUser(null);

    // Only search if user typed >= 3 chars
    if (text.length < 3) {
      setSearchResult(null);
      return;
    }
    try {
      const result = await searchUserProfile(text);
      if (result) {
        setSearchResult(result);
        setSelectedUserProfile(result.profile);
        setSelectedUserGames(result.recentGames);
      } else {
        setSearchResult(null);
        setSelectedUserProfile(null);
        setSelectedUserGames([]);
      }
    } catch (error) {
      console.error("Auto-search error:", error);
      Alert.alert("Error", "Failed to search user profile.");
      setSearchResult(null);
    }
  };

  const handleCloseBtn = () => {
    setSelectedUser(null);
    setSelectedUserProfile(null);
    setSelectedUserGames([]);
  };

  const toggleShowMoreSelectedUserGames = () => {
    setShowMoreSelectedUserGames(!showMoreSelectedUserGames);
  };

  // Add friend (custom backend)
  const handleFriendBtn = async () => {
    if (selectedUserProfile) {
      try {
        const userToRequest = selectedUserProfile.username;
        const result = await addFriend(userToRequest);
        if (result.success) {
          Alert.alert("Success", "Friend request sent successfully.");
        } else {
          Alert.alert("Error", "Failed to send friend request.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to send friend request.");
      }
    }
  };

  // Share news
  const handleShareNews = async (newsItem) => {
    const contentText = `Check out this news: ${newsItem.name}`;
    const sharedNewsId = newsItem.slug;
    try {
      const result = await postNews(contentText, sharedNewsId);
      if (result.success) {
        Alert.alert("Success", "News shared successfully.");
      } else {
        Alert.alert("Error", "Failed to share news.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to share news.");
    }
  };

  // Navigation to other pages
  const navigateClips = () => {
    navigation.navigate("Clips");
  };
  const navigateCommunity = () => {
    navigation.navigate("CommunityPageInsight");
  };
  const navigateNews = () => {
    navigation.navigate("News");
  };

  if (isFetching) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // Filter out linked profiles so only non-signed profiles are shown
  const nonSignedLinkedProfiles = linkedProfiles.filter(
    (profile) => profile.gamertag !== accountInfo?.gamertag
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GamerHUB</Text>

        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navButton} onPress={navigateNews}>
            <Text style={styles.navButtonText}>News</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateClips}>
            <Text style={styles.navButtonText}>Clips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateCommunity}>
            <Text style={styles.navButtonText}>Community Insight</Text>
          </TouchableOpacity>

          {/* SEARCH BAR */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search User..."
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {searchQuery.length >= 3 && searchResult && (
              <TouchableOpacity
                style={styles.searchResultPreview}
                onPress={() => {
                  setSelectedUser(searchResult);
                  setSearchQuery("");
                  setSearchResult(null);
                }}
              >
                <Image
                  style={styles.searchAvatarPreview}
                  source={{
                    uri:
                      searchResult.profile.appDisplayPicRaw ||
                      "https://example.com/default-avatar.png",
                  }}
                />
                <Text style={styles.searchResultText}>
                  {searchResult.profile.gamertag}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* account info - gamertag */}
        <View style={styles.accountSection}>
          <View style={styles.gamertagDisplay}>
            <Text style={styles.gamertagText}>
              {accountInfo?.gamertag || "No Gamertag"}
            </Text>
            {nonSignedLinkedProfiles.length > 0 && (
              <TouchableOpacity onPress={toggleLinkedProfiles}>
                <Text style={styles.toggleLinked}>
                  {showLinkedProfiles ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {accountInfo && (
            <Image
              style={styles.profileImage}
              source={{ uri: accountInfo.appDisplayPicRaw }}
            />
          )}
          {showLinkedProfiles && (
            <View style={styles.linkedProfiles}>
              {nonSignedLinkedProfiles.map((profile, index) => (
                <View key={index} style={styles.linkedProfileItem}>
                  <Image
                    style={styles.linkedProfileImage}
                    source={{ uri: profile.appDisplayPicRaw }}
                  />
                  <Text style={styles.linkedProfileText}>
                    {profile.gamertag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* show mailbox if new request pending */}
        {pendingRequests.length > 0 && (
          <View>
            <TouchableOpacity
              style={styles.mailboxButton}
              onPress={togglePendingList}
            >
              <Text style={styles.mailboxText}>Mailbox</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
              </View>
            </TouchableOpacity>
            {showPendingList && (
              <View style={styles.pendingDropdown}>
                {pendingRequests.map((req) => (
                  <View key={req.id} style={styles.pendingItem}>
                    <Text style={styles.pendingText}>
                      {req.username} sent a follow request ({req.status})
                    </Text>
                    <Button title="Accept" onPress={handleAcceptBtn} />
                    <Button title="Decline" onPress={() => {}} />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.mainRow}>
        <View style={styles.leftColumn}>
          {/* If user selected from search */}
          {selectedUserProfile && (
            <View style={styles.selectedUserContainer}>
              <TouchableOpacity style={styles.closeBtn} onPress={handleCloseBtn}>
                <Text style={styles.closeBtnText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Xbox Profile Details</Text>
              <Text style={styles.userInfoText}>
                Gamertag: {selectedUserProfile.gamertag}
              </Text>
              <Text style={styles.userInfoText}>
                Account Tier: {selectedUserProfile.accountTier}
              </Text>
              <Text style={styles.userInfoText}>
                Gamerscore: {selectedUserProfile.gamerscore}
              </Text>
              <Text style={styles.userInfoText}>
                Tenure Level: {selectedUserProfile.tenureLevel}
              </Text>
              <Button title="Add Friend" onPress={handleFriendBtn} />
              <Image
                style={styles.selectedUserAvatar}
                source={{ uri: selectedUserProfile.gameDisplayPicRaw }}
              />

              {/* Selected user's recent games */}
              <View style={styles.selectedUserGames}>
                <Text style={styles.sectionTitle}>Recent Games</Text>
                <ScrollView horizontal>
                  {selectedUserGames
                    .slice(
                      0,
                      showMoreSelectedUserGames
                        ? selectedUserGames.length
                        : 2
                    )
                    .map((game, index) => (
                      <View key={index} style={styles.selectedUserGameCard}>
                        <Image
                          style={styles.gameImage}
                          source={{ uri: game.displayImage }}
                        />
                        <Text style={styles.gameNameText}>{game.gameName}</Text>
                      </View>
                    ))}
                </ScrollView>
                {selectedUserGames.length > 2 && (
                  <TouchableOpacity
                    style={styles.toggleGamesButton}
                    onPress={toggleShowMoreSelectedUserGames}
                  >
                    <Text style={styles.toggleGamesButtonText}>
                      {showMoreSelectedUserGames ? "Show Less" : "Show More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* NEWS FEED */}
          <View style={styles.newsFeed}>
            <Text style={styles.sectionTitle}>News Feed</Text>
            <View style={styles.contentBox}>
              {isFetchingRecentNews ? (
                <Text style={styles.loadingText}>Loading news...</Text>
              ) : recentNews.length > 0 ? (
                recentNews.map((newsItem, index) => (
                  <View key={index} style={styles.newsItem}>
                    {/* Larger main image */}
                    <Image
                      style={styles.newsMainImage}
                      source={{ uri: newsItem.background_image }}
                    />
                    <View style={styles.newsItemContent}>
                      <Text style={styles.newsTitle}>{newsItem.name}</Text>

                      {/* "Available on" info */}
                      <Text style={styles.newsAvailableOn}>
                        Available on:{" "}
                        {newsItem.platforms && newsItem.platforms.length > 0
                          ? checkAccountType([
                              ...new Set(
                                newsItem.platforms.map((p) =>
                                  p.platform.name.toLowerCase()
                                )
                              ),
                            ])
                          : "N/A"}
                      </Text>

                      <Text style={styles.newsReleaseDate}>
                        Release Date: {newsItem.released}
                      </Text>

                      {/* Share to community */}
                      <Button
                        title="Share to Community"
                        onPress={() => handleShareNews(newsItem)}
                      />
                      <ScrollView horizontal style={styles.screenshotsContainer}>
                        {newsItem.short_screenshots?.map((shot, i) => (
                          <Image
                            key={i}
                            style={styles.screenshotImg}
                            source={{ uri: shot.image }}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.loadingText}>No news found.</Text>
              )}
            </View>
          </View>

          {/* RECENT GAMES (the logged-in user's) */}
          <View style={styles.recentGamesSection}>
            <Text style={styles.sectionTitle}>Recent Games</Text>
            <View style={styles.contentBox}>
              {isFetchingRecentGames ? (
                <Text style={styles.loadingText}>Loading recent games...</Text>
              ) : recentGames.length > 0 ? (
                recentGames.map((game, index) => (
                  <View key={index} style={styles.gameCard}>
                    <Image
                      style={styles.gameImage}
                      source={{ uri: game.displayImage }}
                    />
                    <Text style={styles.gameNameText}>{game.name}</Text>

                    {/* last time played */}
                    <Text style={styles.gameInfoText}>
                      {game.titleHistory &&
                      game.titleHistory.lastTimePlayedFormatted
                        ? `Last Played: ${game.titleHistory.lastTimePlayedFormatted}`
                        : "Playtime not available"}
                    </Text>

                    {/* devices used */}
                    <Text style={styles.gameDevicesText}>
                      {game.devices && game.devices.length > 0
                        ? `Played on: ${game.devices.join(", ")}`
                        : "No devices found"}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.loadingText}>No recent games found.</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <TouchableOpacity
            onPress={toggleFriendsDropDown}
            style={styles.friendsDropDown}
          >
            <Text style={styles.friendsDropDownText}>
              My Friends {isFriendsDropdownOpen ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>
          {isFriendsDropdownOpen && (
            <View style={styles.friendsDropdownContent}>
              {friendsList.length === 0 ? (
                <Text style={styles.friendsText}>No friends found.</Text>
              ) : (
                friendsList.map((friend) => {
                  let gamertag = "";
                  if (friend.xboxProfiles && friend.xboxProfiles.length > 0) {
                    gamertag = friend.xboxProfiles[0].xboxGamertag;
                  }
                  return (
                    <TouchableOpacity
                      key={friend.id}
                      onPress={() => navigateToFriendPage(friend.id)}
                      style={styles.friendItem}
                    >
                      <Text style={styles.friendItemText}>
                        {friend.username}
                        {gamertag ? ` - ${gamertag}` : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}

          {/* Xbox Friends (if platform === xbox) */}
          {platform === "xbox" && (
            <View style={styles.xboxFriendsSection}>
              <Text style={styles.sectionTitle}>Xbox Friends</Text>
              <View style={styles.contentBox}>
                {isFetchingFriends ? (
                  <Text style={styles.loadingText}>Loading friends...</Text>
                ) : friends.length > 0 ? (
                  friends.map((friend, idx) => (
                    <View key={idx} style={styles.xboxFriendItem}>
                      <Image
                        style={styles.xboxFriendAvatar}
                        source={{
                          uri:
                            friend.displayPicRaw ||
                            "https://example.com/default-avatar.png",
                        }}
                      />
                      <View style={styles.xboxFriendInfo}>
                        <Text style={styles.xboxFriendGamertag}>
                          {friend.gamertag}
                        </Text>
                        <Text style={styles.xboxFriendRealName}>
                          {friend.realName || "Unknown"}
                        </Text>
                        <Text style={styles.xboxFriendPresence}>
                          {friend.presenceState === "Online"
                            ? "Online"
                            : friend.presenceText || "Offline"}
                        </Text>
                      </View>
                      {friend.isFavorite && (
                        <Text style={styles.favoriteIcon}>★</Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.loadingText}>No Xbox friends found.</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          About: Created by Ahmad Bishara
          <Text style={styles.footerLink}>  GitHub: ahmadb123</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#333",
    width: "100%",
  },
  logo: {
    fontSize: 24,
    color: "#fff",
    paddingTop: 5,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    backgroundColor: "#444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
  },

  // Search bar
  searchBar: {
    position: "relative",
    width: 220,
    marginLeft: 10,
  },
  searchInput: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 2,
    borderColor: "#444",
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  searchResultPreview: {
    position: "absolute",
    top: 46,
    left: 0,
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  searchAvatarPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#00bfff",
  },
  searchResultText: {
    color: "#fff",
    fontSize: 14,
  },

  // Account Info
  accountSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  gamertagDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  gamertagText: {
    color: "#fff",
    fontSize: 16,
  },
  toggleLinked: {
    color: "#00bfff",
    fontSize: 16,
    marginLeft: 5,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginLeft: 8,
  },
  linkedProfiles: {
    flexDirection: "row",
    marginLeft: 10,
  },
  linkedProfileItem: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 8,
  },
  linkedProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  linkedProfileText: {
    color: "#fff",
    fontSize: 10,
  },

  // Mailbox
  mailboxButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  mailboxText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 5,
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  pendingDropdown: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  pendingItem: {
    marginVertical: 5,
  },
  pendingText: {
    color: "#fff",
    marginBottom: 5,
  },

  /* ===== MAIN TWO-COLUMN LAYOUT ===== */
  mainRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  leftColumn: {
    flex: 3, // 75%
    padding: 10,
  },
  rightColumn: {
    flex: 1, // 25%
    padding: 10,
  },

  /* SELECTED USER */
  selectedUserContainer: {
    position: "relative",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeBtnText: {
    fontSize: 20,
    color: "#00bfff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00bfff",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  userInfoText: {
    color: "#fff",
    marginBottom: 6,
  },
  selectedUserAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#00bfff",
  },
  selectedUserGames: {
    marginTop: 15,
  },
  selectedUserGameCard: {
    backgroundColor: "#333",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
    marginRight: 10,
    width: 100,
  },

  /* NEWS FEED */
  newsFeed: {
    marginBottom: 20,
  },
  contentBox: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: "#333",
  },
  newsItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  newsMainImage: {
    width: 650,
    height: 400,  // bigger display
    resizeMode: "cover"
  },
  newsItemContent: {
    padding: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  newsAvailableOn: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
  },
  newsReleaseDate: {
    fontSize: 12,
    color: "#ccc",
    marginBottom: 8,
  },
  screenshotsContainer: {
    marginTop: 8,
    flexDirection: "row",
  },
  screenshotImg: {
    width: 80,
    height: 50,
    borderRadius: 4,
    marginRight: 8,
    resizeMode: "cover",
  },

  /* RECENT GAMES */
  recentGamesSection: {
    marginBottom: 20,
  },
  gameCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  gameImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  gameNameText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  gameInfoText: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
  gameDevicesText: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },

  /* RIGHT COLUMN FRIENDS */
  friendsDropDown: {
    padding: 10,
    backgroundColor: "#eee",
    marginBottom: 4,
  },
  friendsDropDownText: {
    fontSize: 16,
    color: "#333",
  },
  friendsDropdownContent: {
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  friendsText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 8,
    paddingLeft: 8,
  },
  friendItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  friendItemText: {
    fontSize: 14,
    color: "#333",
  },

  /* XBOX FRIENDS SECTION */
  xboxFriendsSection: {
    marginBottom: 20,
  },
  xboxFriendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  xboxFriendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
    resizeMode: "cover",
  },
  xboxFriendInfo: {
    flex: 1,
  },
  xboxFriendGamertag: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  xboxFriendRealName: {
    color: "#bbb",
    fontSize: 12,
  },
  xboxFriendPresence: {
    color: "#888",
    fontSize: 12,
  },
  favoriteIcon: {
    color: "gold",
    fontSize: 16,
    marginLeft: 6,
  },

  /* TOGGLE GAMES BUTTON */
  toggleGamesButton: {
    backgroundColor: "#555",
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  toggleGamesButtonText: {
    color: "#fff",
  },

  /* FOOTER */
  footer: {
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
  footerLink: {
    color: "#00bfff",
    textDecorationLine: "underline",
  },
});

export default HomePage;
