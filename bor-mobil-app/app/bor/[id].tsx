import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import API from '.././api';
import { useCart } from '../../context/CartContext';

export default function WineDetailScreen() {
  const { id } = useLocalSearchParams();
  const [bor, setBor] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get(`/borok/${id}`).then(res => setBor(res.data));
  }, [id]);

  if (!bor) return <Text>Betöltés...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: `http://10.210.71.176:8080/feltoltesek/${bor.kep_neve}` }} 
        style={styles.image} 
      />
      <View style={styles.details}>
        <Text style={styles.title}>{bor.nev}</Text>
        <Text style={styles.type}>{bor.fajta} - {bor.evjarat}</Text>
        <Text style={styles.description}>{bor.leiras}</Text>
        <Text style={styles.price}>{bor.ar} Ft</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            addToCart(bor);
            alert("Kosárba téve!");
          }}
        >
          <Text style={styles.buttonText}>Kosárba teszem</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300, resizeMode: 'contain' },
  details: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  type: { fontSize: 16, color: '#666', marginVertical: 5 },
  description: { fontSize: 16, lineHeight: 22, marginVertical: 15 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#722f37', marginBottom: 20 },
  button: { backgroundColor: '#722f37', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }
});