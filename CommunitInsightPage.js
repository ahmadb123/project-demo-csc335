import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getAllNews } from "./service/PostNewsService";

const CommunityPage = () => {
  const [news, setNews] = useState([]);
  const [isFetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const result = await getAllNews();
      if (result) {
        setNews(result);
        setFetching(false);
      } else {
        setError("Failed to load news");
        setFetching(false);
      }
    };
    fetchNews();
  }, []);

  const handleLike = (index) => {
    const updatedNews = [...news];
    if (!updatedNews[index].likes) {
      updatedNews[index].likes = 0;
    }
    updatedNews[index].likes += 1;
    setNews(updatedNews);
  };

  const handleAddComment = (index) => {
    Alert.prompt(
      "Add Comment",
      "Enter your comment below:",
      (comment) => {
        if (comment) {
          const updatedNews = [...news];
          if (!updatedNews[index].comments) {
            updatedNews[index].comments = [];
          }
          updatedNews[index].comments.push(comment);
          setNews(updatedNews);
        }
      }
    );
  };

  if (isFetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Community Page</Text>
      {news.map((newsItem, index) => (
        <View key={index} style={styles.newsCard}>
          <Text style={styles.newsTitle}>{newsItem.contentText}</Text>
          <Text style={styles.sharedBy}>Shared by: {newsItem.username}</Text>
          <Image
            source={{ uri: newsItem.backgroundImage }}
            style={styles.newsImage}
          />
          <Text style={styles.releasedText}>Released: {newsItem.released}</Text>
          <Text style={styles.timeShared}>
            Shared on: {new Date(newsItem.timeShared).toLocaleString()}
          </Text>

          {/* Interaction Bar (Like & Comment Buttons) */}
          <View style={styles.interactionBar}>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => handleLike(index)}
            >
              <Text style={styles.buttonText}>👍 Like ({newsItem.likes || 0})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.commentButton}
              onPress={() => handleAddComment(index)}
            >
              <Text style={styles.buttonText}>💬 Comment ({newsItem.comments?.length || 0})</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          {newsItem.comments && newsItem.comments.length > 0 && (
            <View style={styles.commentsSection}>
              <Text style={styles.commentsHeader}>Comments:</Text>
              {newsItem.comments.map((comment, i) => (
                <Text key={i} style={styles.commentText}>
                  {comment}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#ccc",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00bfff",
    textAlign: "center",
    marginBottom: 16,
  },
  newsCard: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  sharedBy: {
    fontSize: 14,
    color: "#bbb",
  },
  newsImage: {
    width: 500,
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  releasedText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  timeShared: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  interactionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  likeButton: {
    backgroundColor: "#00bfff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  commentButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  commentsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  commentsHeader: {
    color: "#00bfff",
    fontSize: 16,
    fontWeight: "bold",
  },
  commentText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 4,
  },
});

export default CommunityPage;
