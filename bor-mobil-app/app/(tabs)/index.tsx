import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import API from '../api';

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
      numColumns={2} // Kétoszlopos elrendezés, mint egy webshopban
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push({ pathname: "/bor/[id]", params: { id: item.bor_id } })}
        >
          {/* Kép megjelenítése a backendről */}
          <Image 
            source={{ uri: `http://10.210.71.176:8080/feltoltesek/${item.kep_neve}` }} 
            style={styles.image} 
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
    elevation: 3, // Árnyék Androidon
    shadowColor: '#000', // Árnyék iOS-en
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    overflow: 'hidden'
  },
  image: { width: '100%', height: 150, resizeMode: 'cover' },
  info: { padding: 10 },
  name: { fontWeight: 'bold', fontSize: 14 },
  price: { color: '#722f37', marginTop: 5, fontWeight: '600' }
});