import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = "http://localhost:8080";
const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error("Error", e);
    }
};

function togglePassword() {
    let password = document.getElementById("passwordInput");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

function LoginPage() {
    const nav = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                const userId = data.id; 
                const username = data.username;
                await storeData('jwtToken', token);
                await storeData('userId', String(userId)); 
                await storeData('username', username);
                nav.navigate('LandingPage'); 
            } else if (response.status === 401) {
                toast.error('Incorrect Password. Please try again.');
            } else {
                const textError = await response.text();
                toast.error(`Login failed: ${textError}`);
            }
        } catch (e) {
            console.error("Error", e);
            toast.error('Error occurred logging in');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <View style={styles.formGroup}>
                <Text>Email or Username</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Email/Username"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>
            <View style={styles.formGroup}>
                <Text>Password</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                />
            </View>
            <TouchableOpacity style={styles.showPassword} onPress={() => setShowPassword(!showPassword)}>
                <Text>{showPassword ? "Hide" : "Show"} Password</Text>
            </TouchableOpacity>
            <Button title="Login" onPress={handleLogin} />
            <Button title="Go Back" onPress={() => nav.goBack('homepage')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 4,
    },
    showPassword: {
        marginBottom: 16,
    },
});

export default LoginPage;