import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import API from '../api';

// A .env fájlból olvassuk be az alap útvonalat (http://10.210.71.176:8080/public/uploads/kep)
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

export default function WineListScreen() {
  const [borok, setBorok] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    API.get("/borok")
      .then(res => {
        setBorok(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API hiba:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} color="#722f37" />;

  return (
    <FlatList
      data={borok}
      keyExtractor={(item) => item.bor_id.toString()}
      numColumns={2}
      renderItem={({ item }) => {
        // --- KÉP GENERÁLÁSA ID ALAPJÁN ---
        // Mivel a fájlok neve pl. "1.jpg", az ID-t összefűzzük a kiterjesztéssel
        const fileName = `${item.bor_id}.jpg`; 
        const fullUri = `${IMAGE_BASE_URL}/${fileName}`;

        return (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: "/bor/[id]", params: { id: item.bor_id } })}
          >
            <Image 
              source={{ uri: fullUri }} 
              style={styles.image}
              resizeMode="cover" // Webes kompatibilitás miatt prop-ként
            />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.nev}</Text>
              <Text style={styles.price}>{item.ar?.toLocaleString()} Ft</Text>
            </View>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, paddingBottom: 20 },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    // Webes árnyék javítás
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)", 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee'
  },
  image: { 
    width: '100%', 
    height: 150, 
    backgroundColor: '#f0f0f0' 
  },
  info: { padding: 10 },
  name: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  price: { color: '#722f37', marginTop: 5, fontWeight: '600' }
});