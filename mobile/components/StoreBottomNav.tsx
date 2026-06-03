import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export type StoreActiveTab = 'dashboard' | 'catalog' | 'store-orders' | 'store-profile';

interface StoreBottomNavProps {
  active: StoreActiveTab;
}

const tabs: { key: StoreActiveTab; label: string; icon: string; route: string }[] = [
  { key: 'dashboard',    label: 'Painel',   icon: 'grid-outline',        route: '/dashboard'    },
  { key: 'catalog',      label: 'Catalogo', icon: 'cube-outline',        route: '/catalog'      },
  { key: 'store-orders', label: 'Pedidos',  icon: 'receipt-outline',     route: '/store-orders' },
  { key: 'store-profile',label: 'Perfil',   icon: 'person-outline',      route: '/store-profile'},
];

export default function StoreBottomNav({ active }: StoreBottomNavProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={isActive ? tab.icon.replace('-outline', '') as any : tab.icon as any}
              size={22}
              color={isActive ? colors.accent : colors.textLight}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 11, color: colors.textLight, fontWeight: '500' },
  labelActive: { color: colors.accent, fontWeight: '600' },
});
