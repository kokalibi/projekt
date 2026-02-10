import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Switch
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import API from './api';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { cart, clearCart, totalAmount } = useCart();
  const router = useRouter();

  /* =======================
     ŰRLAP ÁLLAPOTOK
  ======================= */
  const [form, setForm] = useState({
    teljes_nev: "",
    email: "",
    telefon: "",
    orszag: "Magyarország",
    varos: "",
    iranyitoszam: "",
    cim_sor1: "",
    cim_sor2: ""
  });

  const [szamlazasiForm, setSzamlazasiForm] = useState({
    teljes_nev: "",
    orszag: "Magyarország",
    varos: "",
    iranyitoszam: "",
    cim_sor1: "",
    cim_sor2: ""
  });

  const [azonosCim, setAzonosCim] = useState(true);

  /* =======================
     FIZETÉSI MÓD ÁLLAPOTOK
  ======================= */
  const [fizetesiModok, setFizetesiModok] = useState([]);
  const [valasztottModId, setValasztottModId] = useState(null);

  /* =======================
     UI ÁLLAPOTOK
  ======================= */
  const [loading, setLoading] = useState(false);

  /* =======================
     ADATOK BETÖLTÉSE
  ======================= */
  useEffect(() => {
    // Fizetési módok lekérése a backendről
    API.get("/payment-methods")
      .then(res => {
        setFizetesiModok(res.data);
        if (res.data.length > 0) setValasztottModId(res.data[0].id);
      })
      .catch(err => console.error("Fizetési módok hiba:", err));

    // Automatikus kitöltés ha van bejelentkezett felhasználó
    if (user) {
      setForm(prev => ({
        ...prev,
        teljes_nev: user.nev || "",
        email: user.email || "",
        cim_sor1: user.cim || ""
      }));
    }
  }, [user]);

  /* =======================
     RENDELÉS LEADÁSA
  ======================= */
  const submitOrder = async () => {
    if (cart.length === 0) {
      Alert.alert("Hiba", "A kosarad üres.");
      return;
    }

    if (!form.teljes_nev || !form.email || !form.varos || !form.iranyitoszam || !form.cim_sor1) {
      Alert.alert("Hiba", "Kérlek töltsd ki a kötelező (*) szállítási mezőket.");
      return;
    }

    if (!valasztottModId) {
      Alert.alert("Hiba", "Kérlek válassz fizetési módot.");
      return;
    }

    const veglegesSzamlazasiCim = azonosCim ? form : szamlazasiForm;

    const payload = {
      fizetesi_mod_id: valasztottModId,
      szallitasi_cim: form,
      szamlazasi_cim: veglegesSzamlazasiCim,
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
      const res = await API.post("/orders", payload);
      
      Alert.alert("Sikeres rendelés!", `Rendelésszám: #${res.data.rendeles_id}`, [
        { 
          text: "OK", 
          onPress: async () => {
            await clearCart();
            router.replace('/(tabs)');
          } 
        }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Hiba", "Sikertelen rendelés leadás. Kérlek próbáld újra.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, name, setter, options = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => setter(prev => ({ ...prev, [name]: text }))}
        placeholder={label}
        {...options}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Rendelés befejezése</Text>

      {/* SZÁLLÍTÁSI ADATOK */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Szállítási adatok</Text>
        {renderInput("Teljes név *", form.teljes_nev, "teljes_nev", setForm)}
        {renderInput("Email cím *", form.email, "email", setForm, { keyboardType: "email-address", autoCapitalize: "none" })}
        {renderInput("Telefonszám *", form.telefon, "telefon", setForm, { keyboardType: "phone-pad" })}
        
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {renderInput("Város *", form.varos, "varos", setForm)}
          </View>
          <View style={{ width: 120 }}>
            {renderInput("Irsz. *", form.iranyitoszam, "iranyitoszam", setForm, { keyboardType: "numeric" })}
          </View>
        </View>
        
        {renderInput("Cím (utca, házszám) *", form.cim_sor1, "cim_sor1", setForm)}
        {renderInput("Kiegészítő cím", form.cim_sor2, "cim_sor2", setForm)}
      </View>

      {/* SZÁMLÁZÁSI OPCIÓ */}
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>A számlázási cím megegyezik</Text>
          <Switch
            value={azonosCim}
            onValueChange={setAzonosCim}
            trackColor={{ false: "#ddd", true: "#722f37" }}
          />
        </View>

        {!azonosCim && (
          <View style={{ marginTop: 15, borderTopWidth: 1, borderColor: '#eee', paddingTop: 15 }}>
            <Text style={[styles.cardTitle, { fontSize: 16 }]}>Számlázási adatok</Text>
            {renderInput("Számlázási név *", szamlazasiForm.teljes_nev, "teljes_nev", setSzamlazasiForm)}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                {renderInput("Város *", szamlazasiForm.varos, "varos", setSzamlazasiForm)}
              </View>
              <View style={{ width: 120 }}>
                {renderInput("Irsz. *", szamlazasiForm.iranyitoszam, "iranyitoszam", setSzamlazasiForm, { keyboardType: "numeric" })}
              </View>
            </View>
            {renderInput("Cím *", szamlazasiForm.cim_sor1, "cim_sor1", setSzamlazasiForm)}
          </View>
        )}
      </View>

      {/* FIZETÉSI MÓD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fizetési mód</Text>
        {fizetesiModok.map((mod) => (
          <TouchableOpacity 
            key={mod.id} 
            style={styles.paymentOption}
            onPress={() => setValasztottModId(mod.id)}
          >
            <Ionicons 
              name={valasztottModId === mod.id ? "radio-button-on" : "radio-button-off"} 
              size={22} 
              color={valasztottModId === mod.id ? "#722f37" : "#666"} 
            />
            <Text style={[styles.paymentText, valasztottModId === mod.id && styles.paymentTextActive]}>
              {mod.megnevezes}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ÖSSZESÍTŐ */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Kosár összesen</Text>
        <Text style={styles.totalValue}>{totalAmount.toLocaleString()} Ft</Text>
        
        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={submitOrder} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Rendelés leadása</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  scrollContent: { padding: 15, paddingBottom: 50 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#722f37' },
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 13, color: '#666', marginBottom: 4, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  paymentText: { fontSize: 16, marginLeft: 10, color: '#444' },
  paymentTextActive: { color: '#722f37', fontWeight: 'bold' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  summaryTitle: { fontSize: 16, color: '#666' },
  totalValue: { fontSize: 32, fontWeight: 'bold', color: '#722f37', marginVertical: 10 },
  submitButton: { backgroundColor: '#722f37', width: '100%', padding: 16, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});