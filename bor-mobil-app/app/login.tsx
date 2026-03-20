import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; //
import API from './api'; //

export default function LoginScreen() {
  const { login } = useAuth(); //
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !jelszo) {
      Alert.alert("Hiba", "Kérjük, töltsd ki az összes mezőt!");
      return;
    }

    setLoading(true);
    try {
      // 1. Beküldjük a login kérést a backendnek
      const res = await API.post("/auth/login", { email, jelszo });

      // 2. A válaszban kapott tokent és user adatokat átadjuk a Contextnek
      // A backend a res.data.accessToken és res.data.user objektumot küldi
      await login(res.data.accessToken, res.data.user);

      // 3. Visszairányítunk a profil oldalra
      // A replace-t használjuk, hogy a navigációs stack frissüljön
      router.replace('/explore');
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Hibás email vagy jelszó!";
      Alert.alert("Bejelentkezési hiba", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="wine" size={80} color="#722f37" />
        <Text style={styles.title}>DrágaBorok</Text>
        <Text style={styles.subtitle}>Jelentkezz be a vásárláshoz</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email cím</Text>
          <TextInput
            style={styles.input}
            placeholder="pelda@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jelszó</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            value={jelszo}
            onChangeText={setJelszo}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Bejelentkezés</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => router.push('/register')}
        >
          <Text style={styles.registerText}>Még nincs fiókod? Regisztráció</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666' },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#722f37', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { color: '#007bff', fontSize: 14 }
});