import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import API from './api'; // Mivel egy mappában vannak

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, jelszo: password });
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert("Hiba", "Hibás email vagy jelszó!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drága Borok</Text>
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
      />
      <TextInput 
        placeholder="Jelszó" 
        style={styles.input} 
        secureTextEntry 
        onChangeText={setPassword} 
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.btnText}>Bejelentkezés</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.guestLink}>Böngészés bejelentkezés nélkül</Text>
      </TouchableOpacity>
    </View>
  );
}

// EZ HIÁNYZOTT A FÁJLODBÓL:
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#722f37' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: '#722f37', padding: 15, borderRadius: 8, marginTop: 10 },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  guestLink: { color: '#666', textAlign: 'center', marginTop: 20, fontSize: 14 }
});