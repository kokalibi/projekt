import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, 
  ActivityIndicator, TextInput, ScrollView, Modal 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import API from '../api'; // JAVÍTVA: Két pont kell a kilépéshez!

const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

export default function WineListScreen() {
  const [borok, setBorok] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Szűrő állapotok
  const [search, setSearch] = useState("");
  const [tipus, setTipus] = useState("");
  const [fajta, setFajta] = useState("");
  const [pince, setPince] = useState("");
  const [evjarat, setEvjarat] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ title: '', data: [], setter: null });
  const [options, setOptions] = useState({ tipusok: [], fajtak: [], pincek: [], evjaratok: [] });

  useEffect(() => {
    API.get("/borok")
      .then(res => {
        const data = res.data;
        setBorok(data);
        setOptions({
          tipusok: [...new Set(data.map(b => b.tipus_nev))].filter(Boolean),
          fajtak: [...new Set(data.map(b => b.fajta_nev))].filter(Boolean),
          pincek: [...new Set(data.map(b => b.pince_nev))].filter(Boolean),
          evjaratok: [...new Set(data.map(b => b.evjarat?.toString()))].filter(Boolean).sort().reverse(),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredBorok = borok.filter(b => {
    const matchesSearch = b.nev.toLowerCase().includes(search.toLowerCase()) || 
                          b.pince_nev.toLowerCase().includes(search.toLowerCase());
    const matchesTipus = !tipus || b.tipus_nev === tipus;
    const matchesFajta = !fajta || b.fajta_nev === fajta;
    const matchesPince = !pince || b.pince_nev === pince;
    const matchesEvjarat = !evjarat || b.evjarat?.toString() === evjarat;
    return matchesSearch && matchesTipus && matchesFajta && matchesPince && matchesEvjarat;
  });

  const openFilter = (title, data, setter) => {
    setCurrentFilter({ title, data, setter });
    setModalVisible(true);
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} color="#722f37" />;

  return (
    <View style={styles.container}>
      {/* KERESŐ ÉS SZŰRŐK */}
      <View style={styles.header}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Keresés..." 
          value={search} 
          onChangeText={setSearch} 
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterBtn, tipus && styles.activeBtn]} onPress={() => openFilter("Típus", options.tipusok, setTipus)}>
            <Text style={tipus ? styles.activeText : styles.btnText}>{tipus || "Típus"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, fajta && styles.activeBtn]} onPress={() => openFilter("Fajta", options.fajtak, setFajta)}>
            <Text style={fajta ? styles.activeText : styles.btnText}>{fajta || "Fajta"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, pince && styles.activeBtn]} onPress={() => openFilter("Pince", options.pincek, setPince)}>
            <Text style={pince ? styles.activeText : styles.btnText}>{pince || "Pince"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, evjarat && styles.activeBtn]} onPress={() => openFilter("Év", options.evjaratok, setEvjarat)}>
            <Text style={evjarat ? styles.activeText : styles.btnText}>{evjarat || "Év"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredBorok}
        keyExtractor={(item) => item.bor_id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/bor/${item.bor_id}`)}>
            <Image source={{ uri: `${IMAGE_BASE_URL}/${item.bor_id}.jpg` }} style={styles.image} resizeMode="contain" />
            <View style={styles.cardInfo}>
              <Text style={styles.wineName} numberOfLines={1}>{item.nev}</Text>
              <Text style={styles.winePrice}>{item.ar?.toLocaleString()} Ft</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentFilter.title}</Text>
            <FlatList
              data={["Összes törlése", ...currentFilter.data]}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => {
                    currentFilter.setter(item === "Összes törlése" ? "" : item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={item === "Összes törlése" ? {color: 'red'} : {}}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={{color: '#fff'}}>Bezárás</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 15, backgroundColor: '#fff', elevation: 2 },
  searchBar: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10, marginBottom: 10 },
  filterRow: { flexDirection: 'row' },
  filterBtn: { borderColor: '#722f37', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1 },
  activeBtn: { backgroundColor: '#722f37' },
  btnText: { color: '#722f37' },
  activeText: { color: '#fff' },
  card: { flex: 1, margin: 5, backgroundColor: '#fff', borderRadius: 10, elevation: 2, padding: 10 },
  image: { width: '100%', height: 120 },
  cardInfo: { marginTop: 10 },
  wineName: { fontWeight: 'bold' },
  winePrice: { color: '#722f37', marginTop: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '80%', borderRadius: 20, padding: 20, maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#722f37' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeBtn: { marginTop: 20, backgroundColor: '#722f37', padding: 10, borderRadius: 10, alignItems: 'center' }
});