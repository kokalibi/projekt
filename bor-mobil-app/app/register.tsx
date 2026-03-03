import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext'; //
import API from './api'; //

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth(); //

  const [form, setForm] = useState({
    nev: '',
    email: '',
    jelszo: '',
    cim: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.nev || !form.email || !form.jelszo) {
      Alert.alert("Hiba", "A név, email és jelszó kitöltése kötelező!");
      return;
    }

    setLoading(true);
    try {
      // 1. Adatok beküldése a backendnek
      const res = await API.post("/auth/register", form);

      // 2. Automatikus bejelentkezés a regisztráció után
      // A backend visszaküldi az accessToken-t és a user objektumot
      await login(res.data.accessToken, res.data.user);

      Alert.alert("Siker", "Sikeres regisztráció!", [
        { text: "OK", onPress: () => router.replace('/explore') }
      ]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Hiba történt a regisztráció során.";
      Alert.alert("Regisztrációs hiba", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Új fiók létrehozása</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Teljes név"
          value={form.nev}
          onChangeText={(t) => setForm({...form, nev: t})}
        />
        <TextInput
          style={styles.input}
          placeholder="Email cím"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(t) => setForm({...form, email: t})}
        />
        <TextInput
          style={styles.input}
          placeholder="Jelszó"
          secureTextEntry
          value={form.jelszo}
          onChangeText={(t) => setForm({...form, jelszo: t})}
        />
        <TextInput
          style={[styles.input, {height: 80}]}
          placeholder="Szállítási cím (opcionális)"
          multiline
          value={form.cim}
          onChangeText={(t) => setForm({...form, cim: t})}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Regisztráció</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#722f37' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 4 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 20, padding: 10, fontSize: 16 },
  button: { backgroundColor: '#722f37', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});