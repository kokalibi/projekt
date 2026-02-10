import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native';


// --- SZIMULÁLT INTERFÉSZEK A FORDÍTÁSHOZ ---
const AuthContext = createContext({
  user: { nev: 'Teszt Felhasználó', email: 'teszt@email.hu', cim: 'Budapest, Fő utca 1.' },
  logout: async () => {},
  isAuthenticated: true
});
const useAuth = () => useContext(AuthContext);

const useRouter = () => ({
  replace: (path: string) => console.log("Navigáció ide:", path),
});

// Szimulált Ionicons
const Ionicons = ({ name, size, color }: any) => (
  <Text style={{ fontSize: size, color: color }}>●</Text>
);

const API = {
  put: async (url: string, data: any) => ({ data: { success: true } })
};

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Profil adatok állapotai
  const [formData, setFormData] = useState({
    nev: '',
    email: '',
    cim: '',
    jelszo: ''
  });
  
  const [saving, setSaving] = useState(false);

  // Adatok betöltése a kontextusból
  useEffect(() => {
    if (user) {
      setFormData({
        nev: user.nev || '',
        email: user.email || '',
        cim: user.cim || '',
        jelszo: '' // Jelszót biztonsági okokból nem töltünk be előre
      });
    }
  }, [user]);

  // Mentés folyamata
  const handleUpdate = async () => {
    if (!formData.nev || !formData.email) {
      Alert.alert("Hiba", "A név és az email kötelező mező!");
      return;
    }

    try {
      setSaving(true);
      // Meghívjuk a szerveren lévő profil frissítés végpontot
      const res = await API.put("/users/profile", formData);
      
      if (res.data.success) {
        Alert.alert("Siker", "A profilod adatai frissültek!");
      }
    } catch (err) {
      console.error("Profil frissítési hiba:", err);
      Alert.alert("Hiba", "Nem sikerült menteni a módosításokat.");
    } finally {
      setSaving(false);
    }
  };

  // Kijelentkezés folyamata
  const handleLogout = async () => {
    Alert.alert(
      "Kijelentkezés",
      "Biztosan ki szeretnél jelentkezni?",
      [
        { text: "Mégse", style: "cancel" } as any,
        { 
          text: "Kijelentkezés", 
          onPress: async () => {
            await logout();
            router.replace('/'); // Vissza a bejelentkezéshez
          },
          style: "destructive"
        } as any
      ]
    );
  };

  // Ha nincs bejelentkezve, ajánljuk fel a belépést
  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <Ionicons name="lock-closed" size={64} color="#ccc" />
        <Text style={styles.notLoggedText}>A profil megtekintéséhez be kell jelentkezned.</Text>
        <TouchableOpacity 
          style={styles.loginBtn} 
          onPress={() => router.replace('/')}
        >
          <Text style={styles.loginBtnText}>Bejelentkezés</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={50} color="#fff" />
        </View>
        <Text style={styles.userName}>{user?.nev}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Profil adatok szerkesztése</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Név</Text>
          <TextInput
            style={styles.input}
            value={formData.nev}
            onChangeText={(v) => setFormData({...formData, nev: v})}
            placeholder="Teljes név"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email cím</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(v) => setFormData({...formData, email: v})}
            placeholder="Email cím"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Szállítási cím</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.cim}
            onChangeText={(v) => setFormData({...formData, cim: v})}
            placeholder="Irányítószám, Város, Utca..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Új jelszó (Hagyd üresen, ha nem változik)</Text>
          <TextInput
            style={styles.input}
            value={formData.jelszo}
            onChangeText={(v) => setFormData({...formData, jelszo: v})}
            placeholder="Új jelszó"
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Adatok mentése</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#722f37" />
        <Text style={styles.logoutBtnText}>Kijelentkezés</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatarCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#722f37', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 16, color: '#666' },
  formCard: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 20, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#722f37' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#888', marginBottom: 5, fontWeight: '600' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: { 
    backgroundColor: '#722f37', 
    padding: 15, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  logoutBtn: { 
    marginTop: 30, 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#722f37', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  logoutBtnText: { color: '#722f37', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  notLoggedText: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 20 },
  loginBtn: { backgroundColor: '#722f37', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  loginBtnText: { color: '#fff', fontWeight: 'bold' }
});