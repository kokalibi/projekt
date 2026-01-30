import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Ikonokhoz

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: `http://10.210.71.176:8080/feltoltesek/${item.kep_neve}` }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nev}</Text>
        <Text style={styles.itemPrice}>{item.ar} Ft / db</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.bor_id, item.mennyiseg - 1)}>
            <Ionicons name="remove-circle-outline" size={30} color="#722f37" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.mennyiseg}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.bor_id, item.mennyiseg + 1)}>
            <Ionicons name="add-circle-outline" size={30} color="#722f37" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(item.bor_id)}>
            <Ionicons name="trash-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
      
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Összesen:</Text>
          <Text style={styles.totalValue}>{cart.reduce((sum, i) => sum + (i.ar * i.mennyiseg), 0)} Ft</Text>
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
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', margin: 10, borderRadius: 10, padding: 10, elevation: 2 },
  itemImage: { width: 80, height: 80, borderRadius: 5 },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { color: '#722f37' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  quantityText: { fontSize: 18, marginHorizontal: 15, fontWeight: 'bold' },
  deleteButton: { marginLeft: 'auto' },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#eee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18 },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#722f37' },
  checkoutButton: { backgroundColor: '#722f37', padding: 15, borderRadius: 10 },
  checkoutText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginTop: 10 },
  shopButton: { marginTop: 20, backgroundColor: '#722f37', padding: 12, borderRadius: 8 },
  shopButtonText: { color: '#fff', fontWeight: 'bold' }
});