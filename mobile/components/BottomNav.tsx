import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

type ActiveTab = 'home' | 'search' | 'cart' | 'profile';

interface BottomNavProps {
  active: ActiveTab;
}

const tabs: { key: ActiveTab; label: string; icon: string; route: string }[] = [
  { key: 'home',    label: 'Início',    icon: '🏠', route: '/'        },
  { key: 'search',  label: 'Buscar',    icon: '🔍', route: '/'        },
  { key: 'cart',    label: 'Carrinho',  icon: '🛒', route: '/cart'    },
  { key: 'profile', label: 'Perfil',    icon: '👤', route: '/'        },
];

export default function BottomNav({ active }: BottomNavProps) {
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
            <Text style={styles.icon}>{tab.icon}</Text>
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
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  icon: { fontSize: 22 },
  label: { fontSize: 11, color: colors.textLight, fontWeight: '500' },
  labelActive: { color: colors.accent, fontWeight: '600' },
});
