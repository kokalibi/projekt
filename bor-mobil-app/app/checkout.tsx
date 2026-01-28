import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';
import API from './api';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { cart, clearCart, totalAmount } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Űrlap állapot (A Checkout.jsx 23. sora alapján)
  const [form, setForm] = useState({
    teljes_nev: "",
    email: "",
    telefon: "",
    orszag: "Magyarorszag",
    varos: "",
    iranyitoszam: "",
    cim_sor1: "",
    cim_sor2: ""
  });

  // Automatikus kitöltés ha van bejelentkezett júzer (Checkout.jsx 52. sor)
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        teljes_nev: user.nev || "",
        email: user.email || "",
        cim_sor1: user.cim || ""
      }));
    }
  }, [user]);

  const submitOrder = async () => {
    // Validáció (Checkout.jsx 91. sor)
    if (cart.length === 0) {
      Alert.alert("Hiba", "A kosarad üres.");
      return;
    }

    if (!form.teljes_nev || !form.varos || !form.iranyitoszam || !form.cim_sor1) {
      Alert.alert("Hiba", "Kérlek töltsd ki a kötelező (*) mezőket.");
      return;
    }

    // Payload összeállítása a backend Order.create modelljéhez
    const payload = {
      fizetesi_mod: "utanvet",
      szallitasi_cim: form,
      szamlazasi_cim: form, // Alapértelmezetten megegyezik a szállításival
      vegosszeg: totalAmount,
      kosar: cart.map(item => ({
        bor_id: item.bor_id,
        bor_nev: item.nev,
        egysegar: Number(item.ar),
        mennyiseg: Number(item.mennyiseg || 1)
      }))
    };

    try {
      setLoading(true);
      // Beküldés a backend /orders végpontjára (order_routes.js 18. sor)
      const res = await API.post("/orders", payload);
      
      Alert.alert("Sikeres rendelés!", `Azonosító: ${res.data.rendeles_id}`);
      await clearCart();
      router.replace('/(tabs)'); // Vissza a főoldalra
    } catch (err) {
      console.error(err);
      Alert.alert("Hiba", "Sikertelen rendelés leadás.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Szállítási adatok</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Teljes név *</Text>
        <TextInput style={styles.input} value={form.teljes_nev} onChangeText={(v) => setForm({...form, teljes_nev: v})} />
        
        <Text style={styles.label}>Email cím</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={(v) => setForm({...form, email: v})} keyboardType="email-address" />
        
        <Text style={styles.label}>Telefonszám</Text>
        <TextInput style={styles.input} value={form.telefon} onChangeText={(v) => setForm({...form, telefon: v})} keyboardType="phone-pad" />

        <View style={styles.row}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={styles.label}>Város *</Text>
            <TextInput style={styles.input} value={form.varos} onChangeText={(v) => setForm({...form, varos: v})} />
          </View>
          <View style={{width: 100}}>
            <Text style={styles.label}>Irányítószám *</Text>
            <TextInput style={styles.input} value={form.iranyitoszam} onChangeText={(v) => setForm({...form, iranyitoszam: v})} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.label}>Cím (utca, házszám) *</Text>
        <TextInput style={styles.input} value={form.cim_sor1} onChangeText={(v) => setForm({...form, cim_sor1: v})} />

        <Text style={styles.label}>Kiegészítő cím (emelet, ajtó)</Text>
        <TextInput style={styles.input} value={form.cim_sor2} onChangeText={(v) => setForm({...form, cim_sor2: v})} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Összesítés</Text>
        <Text style={styles.totalText}>{totalAmount.toLocaleString()} Ft</Text>
        
        <TouchableOpacity 
          style={[styles.submitButton, loading && {opacity: 0.7}]} 
          onPress={submitOrder} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Rendelés leadása</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  formGroup: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 15, fontSize: 16 },
  row: { flexDirection: 'row' },
  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 40, alignItems: 'center' },
  summaryTitle: { fontSize: 18, color: '#666' },
  totalText: { fontSize: 26, fontWeight: 'bold', color: '#722f37', marginVertical: 10 },
  submitButton: { backgroundColor: '#722f37', width: '100%', padding: 15, borderRadius: 8, marginTop: 10 },
  submitText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }
});