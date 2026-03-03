import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#722f37' }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Borok', 
          tabBarIcon: ({color}) => <Ionicons name="wine" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="cart" 
        options={{ 
          title: 'Kosár', 
          tabBarIcon: ({color}) => (
            <View>
              <Ionicons name="cart" size={24} color={color} />
              {itemCount > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{itemCount}</Text></View>
              )}
            </View>
          ) 
        }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: isAuthenticated ? 'Profil' : 'Belépés', 
          tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', right: -6, top: -3, backgroundColor: 'red', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' }
});