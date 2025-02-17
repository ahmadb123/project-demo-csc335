
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styles from '../../assets/HomePageStyles';
// import { useNavigation } from '@react-navigation/native';

function HomePage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>GamerHUB Home</Text>
      
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