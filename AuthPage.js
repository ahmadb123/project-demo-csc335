
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const apiUrl = 'http://localhost:8080';

function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const register = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      if (response.ok) {
        console.log("complete success");
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        console.error("error" + data);
      }
    } catch (e) {
      console.error("Error", e);
    }
  };

  return (
    <View style={styles.registerContainer}>
      <Text style={styles.heading}>Create Account</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username (e.g. John123)"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password (e.g. Xb12@00)"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Email (e.g. john@example.com)"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      
      <TouchableOpacity style={styles.submitButton} onPress={register}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    registerContainer: {
      padding: 20,
      // add additional styling as needed
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    formGroup: {
      marginBottom: 15,
    },
    label: {
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },
    submitButton: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  

export default AuthPage;