import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import API from './api'; // Mivel egy mappában vannak

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  /**
   * Bejelentkezési folyamat kezelése
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hiba", "Kérlek töltsd ki az összes mezőt!");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, jelszo: password });
      // Sikeres belépés után a főoldalra irányítunk
      router.replace('/(tabs)');
    } catch (err) {
      console.error("Belépési hiba:", err);
      Alert.alert("Hiba", "Hibás email vagy jelszó!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Drága Borok</Text>
      
      <View style={styles.card}>
        <TextInput 
          placeholder="Email" 
          style={styles.input} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
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

        {/* REGISZTRÁCIÓS GOMB / LINK */}
        <View style={styles.registerContainer}>
          <Text style={styles.noAccountText}>Még nincs fiókod? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Regisztráció</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.guestButton}>
        <Text style={styles.guestLink}>Böngészés bejelentkezés nélkül</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#f8f9fa' 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 40, 
    color: '#722f37' 
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#eee', 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 10,
    backgroundColor: '#fafafa'
  },
  button: { 
    backgroundColor: '#722f37', 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 10 
  },
  btnText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  noAccountText: {
    color: '#666',
    fontSize: 15,
  },
  registerLink: {
    color: '#722f37',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  guestButton: {
    marginTop: 30,
  },
  guestLink: { 
    color: '#888', 
    textAlign: 'center', 
    fontSize: 14,
    fontStyle: 'italic'
  }
});