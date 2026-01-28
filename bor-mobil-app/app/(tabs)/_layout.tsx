import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Ez az import gyakran hiányzik
import { useCart } from '../../context/CartContext'; // A kosár adatokhoz
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { itemCount } = useCart(); // Lekérjük a kosárban lévő tételek számát

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#722f37', // Borvörös aktív szín
        tabBarInactiveTintColor: 'gray',
      }}>
      
      {/* Borlista fül */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Borok',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wine" size={size} color={color} />
          ),
        }}
      />

      {/* Kosár fül jelvénnyel (Badge) */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Kosár',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, margin: 5 }}>
              <Ionicons name="cart" size={size} color={color} />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* Felfedezés fül */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Felfedezés',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});