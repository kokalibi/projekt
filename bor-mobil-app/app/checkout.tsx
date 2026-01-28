import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import API from './api';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    teljes_nev: "", email: "", varos: "", iranyitoszam: "", cim_sor1: ""
  });

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
    const payload = {
      fizetesi_mod: "utanvet",
      szallitasi_cim: form,
      kosar: [] // Ide jön a CartContext tartalma
    };
    try {
      const res = await API.post("/orders", payload);
      Alert.alert("Siker", "Rendelés azonosító: " + res.data.rendeles_id);
    } catch (e) { Alert.alert("Hiba", "Sikertelen rendelés"); }
  };

  return (
    <ScrollView style={{padding: 20}}>
      <TextInput placeholder="Név" value={form.teljes_nev} onChangeText={t => setForm({...form, teljes_nev: t})} />
      <TextInput placeholder="Email" value={form.email} onChangeText={t => setForm({...form, email: t})} />
      {/* ... további mezők ... */}
      <TouchableOpacity onPress={submitOrder}><Text>Rendelés leadása</Text></TouchableOpacity>
    </ScrollView>
  );
}