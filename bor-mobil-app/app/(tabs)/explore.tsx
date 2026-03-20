import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import API from '../api';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ nev: '', email: '', cim: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nev: user.nev || '',
        email: user.email || '',
        cim: user.cim || '',
      });
    }
  }, [user]);

  // Adatok mentése (csak bejelentkezve)
  const handleUpdate = async () => {
    setSaving(true);
    try {
      await API.put("/user/update", formData);
      Alert.alert("Siker", "Adataidat frissítettük!");
    } catch (err) {
      Alert.alert("Hiba", "Nem sikerült a mentés.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <ActivityIndicator size="large" color="#722f37" style={{flex: 1}} />;

  // --- 1. ESET: NINCS BEJELENTKEZVE ---
  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#ccc" />
        <Text style={styles.title}>Profil eléréséhez jelentkezz be</Text>
        
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Bejelentkezés</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>Még nincs fiókod? Regisztráció</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- 2. ESET: BE VAN JELENTKEZVE ---
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Szia, {user?.nev}!</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Név</Text>
        <TextInput 
          style={styles.input} 
          value={formData.nev} 
          onChangeText={(t) => setFormData({...formData, nev: t})} 
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={[styles.input, {backgroundColor: '#eee'}]} 
          value={formData.email} 
          editable={false} 
        />

        <Text style={styles.label}>Szállítási cím</Text>
        <TextInput 
          style={styles.input} 
          value={formData.cim} 
          multiline
          onChangeText={(t) => setFormData({...formData, cim: t})} 
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Mentés</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Kijelentkezés</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 20, margin: 15, borderRadius: 10, elevation: 3 },
  title: { fontSize: 18, marginVertical: 20, color: '#555', textAlign: 'center' },
  label: { fontWeight: 'bold', marginBottom: 5, color: '#722f37' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 15 },
  loginButton: { backgroundColor: '#722f37', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center' },
  saveButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  registerLink: { marginTop: 20 },
  registerText: { color: '#007bff' },
  logoutButton: { marginTop: 20, alignItems: 'center' },
  logoutText: { color: '#dc3545' },
  header: { padding: 20, alignItems: 'center' },
  welcome: { fontSize: 22, fontWeight: 'bold' }
});