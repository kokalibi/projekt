import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import API from '../api';

// A .env fájlból olvassuk be az útvonalat: http://10.210.71.176:8080/public/uploads/kep
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
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{flex:1}} color="#722f37" />;

  return (
    <FlatList
      data={borok}
      keyExtractor={(item) => item.bor_id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push({ pathname: "/bor/[id]", params: { id: item.bor_id } })}
        >
          <Image 
            source={{ uri: `${IMAGE_BASE_URL}/${item.kep_neve}` }} 
            style={styles.image}
            resizeMode="cover" // Így add meg, ne a style-ban!
          />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{item.nev}</Text>
            <Text style={styles.price}>{item.ar} Ft</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    // A deprecated árnyékok helyett egyszerű boxShadow-t használunk weben
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    overflow: 'hidden'
  },
  image: { 
    width: '100%', 
    height: 150, 
    backgroundColor: '#f0f0f0', // Ha ezt látod, a kép nem tölt be az URL-ről
    display: 'flex', // Webes kényszerítés
  },
  info: { padding: 10 },
  name: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  price: { color: '#722f37', marginTop: 5, fontWeight: '600' }
});