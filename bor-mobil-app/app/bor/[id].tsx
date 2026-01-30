import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import API from '.././api';
import { useCart } from '../../context/CartContext';

// A .env fájlból olvassuk az útvonalat
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

export default function WineDetailScreen() {
  const { id } = useLocalSearchParams();
  const [bor, setBor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Egy adott bor adatainak lekérése
    API.get(`/borok/${id}`)
      .then(res => {
        setBor(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a részletek betöltésekor:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{flex:1}} color="#722f37" />;
  if (!bor) return <View style={styles.container}><Text>A termék nem található.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {/* Nagy kép megjelenítése a .env-ben megadott mappából */}
      <Image 
        source={{ uri: `${IMAGE_BASE_URL}/${bor.kep_neve}` }} 
        style={styles.image}
        resizeMode="contain" // A webes hiba elkerülése érdekében prop-ként
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{bor.nev}</Text>
        <Text style={styles.price}>{bor.ar.toLocaleString()} Ft</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Leírás</Text>
        <Text style={styles.description}>{bor.leiras || "Nincs elérhető leírás ehhez a borhoz."}</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            addToCart(bor);
            // Visszajelzés a felhasználónak
            alert(`${bor.nev} hozzáadva a kosárhoz!`);
          }}
        >
          <Text style={styles.buttonText}>Kosárba teszem</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Vissza a listához</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { 
    width: '100%', 
    height: 350, 
    backgroundColor: '#f9f9f9' 
  },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 22, color: '#722f37', fontWeight: 'bold', marginVertical: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#555' },
  description: { fontSize: 16, lineHeight: 24, color: '#666', marginBottom: 30 },
  button: { 
    backgroundColor: '#722f37', 
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 10, alignItems: 'center' },
  backButtonText: { color: '#722f37', fontSize: 16 }
});