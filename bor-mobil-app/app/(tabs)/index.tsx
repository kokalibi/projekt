import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../api'; // Mivel egy mappában vannak az index.tsx-el
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, jelszo: password });
      // Sikeres belépés után átirányítás a tabs (főoldal) részre
      router.replace('/(tabs)'); 
    } catch (err) {
      Alert.alert("Hiba", err.response?.data?.error || "Szerverhiba");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monkey Wine Mobil</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Jelszó" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Bejelentkezés</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20,
    color: '#722f37' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 5 
  },
  button: { 
    backgroundColor: '#722f37', 
    padding: 15, 
    borderRadius: 5 
  },
  buttonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  }
});