import React, { useState, createContext, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';

/**
 * Szimulált környezet a Canvas fordításhoz. 
 * Éles fejlesztésnél használd az importokat:
 * import { useRouter } from 'expo-router';
 * import { useAuth } from '../context/AuthContext';
 * import API from './api';
 */

// --- SZIMULÁLT INTERFÉSZEK ---
const AuthContext = createContext({
  login: async (token: string, user: any) => {},
});
const useAuth = () => useContext(AuthContext);

const useRouter = () => ({
  push: (path: string) => console.log("Navigáció:", path),
  replace: (path: string) => console.log("Csere:", path),
  back: () => console.log("Visszalépés"),
});

const API = {
  post: async (url: string, data: any) => ({ data: { message: "Sikeres regisztráció" } })
};

export default function RegisterScreen() {
  const router = useRouter();
  // A login függvényt már nem hívjuk meg itt, mivel nem jelentkeztetünk be automatikusan
  
  const [form, setForm] = useState({
    nev: '',
    email: '',
    jelszo: '',
    cim: ''
  });

  const [loading, setLoading] = useState(false);

  /**
   * Regisztráció kezelése
   */
  const handleRegister = async () => {
    if (!form.nev || !form.email || !form.jelszo) {
      Alert.alert("Hiba", "A név, email és jelszó mezők kitöltése kötelező!");
      return;
    }

    try {
      setLoading(true);
      // Backend kérés elküldése
      await API.post("/auth/register", form);
      
      // Sikeres regisztráció után üzenet és visszadobás a login-hoz
      Alert.alert(
        "Sikeres regisztráció!", 
        "Fiókod elkészült. Kérlek jelentkezz be az adataiddal.", 
        [
          { 
            text: "Tovább a bejelentkezéshez", 
            onPress: () => router.back() // Visszatérünk a login oldalra
          }
        ]
      );
    } catch (err: any) {
      Alert.alert("Regisztráció sikertelen", "Hiba történt a regisztráció során. Kérlek próbáld újra később.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Regisztráció</Text>
        <Text style={styles.subtitle}>Hozz létre egy fiókot a rendeléshez!</Text>
      </View>

      <View style={styles.card}>
        {/* Név */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teljes név *</Text>
          <TextInput
            style={styles.input}
            placeholder="Név"
            value={form.nev}
            onChangeText={(v) => setForm({ ...form, nev: v })}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email cím *</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
          />
        </View>

        {/* Jelszó */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jelszó *</Text>
          <TextInput
            style={styles.input}
            placeholder="Legalább 6 karakter"
            secureTextEntry
            value={form.jelszo}
            onChangeText={(v) => setForm({ ...form, jelszo: v })}
          />
        </View>

        {/* Lakcím */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Szállítási cím</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Város, utca, házszám..."
            multiline
            numberOfLines={3}
            value={form.cim}
            onChangeText={(v) => setForm({ ...form, cim: v })}
          />
        </View>

        {/* Gomb */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Fiók létrehozása</Text>
          )}
        </TouchableOpacity>

        {/* Vissza a bejelentkezéshez link */}
        <View style={styles.loginContainer}>
          <Text style={styles.hasAccountText}>Már van fiókod? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLinkText}>Bejelentkezés</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#722f37',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  hasAccountText: {
    color: '#666',
  },
  loginLinkText: {
    color: '#722f37',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});