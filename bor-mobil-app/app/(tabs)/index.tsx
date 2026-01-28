import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import API from '../api';

// A .env fájlból olvassuk be az útvonalat
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
        // --- DINAMIKUS HIBAJAVÍTÁS ---
        // Megnézzük, melyik mezőben van a kép neve (kep_neve vagy kep)
        const fileName = item.kep_neve || item.kep; 
        const fullUri = `${IMAGE_BASE_URL}/${fileName}`;

        // Ha még mindig undefined-ot látsz a konzolban, nézd meg mi van az 'item'-ben:
        // console.log("Ez jön a backendről egy borhoz:", item); 

        return (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: "/bor/[id]", params: { id: item.bor_id } })}
          >
            <Image 
              source={{ uri: fullUri }} 
              style={styles.image}
              resizeMode="cover" // Fontos a webes megjelenítéshez
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
    // Webes árnyék (a konzol hiba javítása: shadow helyett boxShadow)
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