
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import styles from './assets/HomePageStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

const getUsername = async (value) => {
  try {
    const data = await AsyncStorage.getItem(value);
    return data;
  } catch (e) {
    console.error("Error", e);
  }
};

function HomePage() {

  const [username, setUsername] = useState('');
  useEffect(() => {
    const fetchUsername = async () => {
      const user = await getUsername('username');
      if(user){
        setUsername(user);
      }
    };
    fetchUsername();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>GamerHUB Home</Text>
      <Text style={styles.subHeader}>Welcome, {username}</Text>    
      {/* News Feed Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>News Feed</Text>
        <View style={styles.box}>
          <Text>Placeholder for News Feed</Text>
        </View>
      </View>
      
      {/* Friends Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        <View style={styles.box}>
          <Text>Placeholder for Friends List</Text>
        </View>
      </View>
      
      {/* Recent Games Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Games</Text>
        <View style={styles.box}>
          <Text>Placeholder for Recent Games</Text>
        </View>
      </View>
      
      {/* Footer */}
      <Text style={styles.footer}>About: Created by Ahmad Bishara</Text>
    </ScrollView>

  );
}

export default HomePage;