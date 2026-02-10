import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// A .env fájlból olvassuk be az alap útvonalat (http://localhost:8080/public/uploads/kep)
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const renderItem = ({ item }) => {
    // Meghatározzuk a teljes elérési utat a backend public mappájához
    const fullUri = `${IMAGE_BASE_URL}/${item.bor_id}.jpg`;

    return (
      <View style={styles.cartItem}>
        <Image 
          source={{ uri: fullUri }} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.nev}</Text>
          <Text style={styles.itemPrice}>{Number(item.ar).toLocaleString()} Ft / db</Text>
          
          <View style={styles.quantityContainer}>
            {/* Mennyiség csökkentése */}
            <TouchableOpacity onPress={() => updateQuantity(item.bor_id, item.mennyiseg - 1)}>
              <Ionicons name="remove-circle-outline" size={30} color="#722f37" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.mennyiseg}</Text>
            
            {/* Mennyiség növelése */}
            <TouchableOpacity onPress={() => updateQuantity(item.bor_id, item.mennyiseg + 1)}>
              <Ionicons name="add-circle-outline" size={30} color="#722f37" />
            </TouchableOpacity>
            
            {/* Törlés gomb */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(item.bor_id)}>
              <Ionicons name="trash-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Üres kosár esetén megjelenő nézet
  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>A kosarad üres.</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.shopButtonText}>Irány a borokhoz!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.bor_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      
      {/* Alsó összesítő sáv */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Összesen:</Text>
          <Text style={styles.totalValue}>
            {cart.reduce((sum, i) => sum + (i.ar * i.mennyiseg), 0).toLocaleString()} Ft
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutText}>Fizetéshez tovább</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  cartItem: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    marginHorizontal: 10, 
    marginVertical: 5, 
    borderRadius: 12, 
    padding: 10, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  itemImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 8,
    backgroundColor: '#f9f9f9'
  },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemPrice: { color: '#722f37', fontWeight: '500' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  quantityText: { fontSize: 18, marginHorizontal: 15, fontWeight: 'bold' },
  deleteButton: { marginLeft: 'auto' },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopWidth: 1, 
    borderColor: '#eee',
    elevation: 10
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, color: '#666' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#722f37' },
  checkoutButton: { backgroundColor: '#722f37', padding: 16, borderRadius: 10 },
  checkoutText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 10 },
  shopButton: { 
    marginTop: 20, 
    backgroundColor: '#722f37', 
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 25 
  },
  shopButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});