import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';

const MENU_ITEMS = [
  { icon: 'receipt-long' as const, label: 'Meus Pedidos' },
  { icon: 'favorite' as const, label: 'Favoritos' },
  { icon: 'location-on' as const, label: 'Endereços' },
  { icon: 'notifications' as const, label: 'Notificações' },
  { icon: 'help' as const, label: 'Ajuda' },
];

export default function Perfil() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <MaterialIcons name={item.icon} size={22} color={Colors.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <MaterialIcons name="logout" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 60, paddingBottom: 32, alignItems: 'center' },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: Colors.white },
  name: { fontSize: 20, fontWeight: '700', color: Colors.white },
  email: { fontSize: 13, color: Colors.white, opacity: 0.75, marginTop: 2 },
  section: {
    margin: 16, backgroundColor: Colors.white, borderRadius: 10,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 16, gap: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuLabel: { fontSize: 15, color: Colors.text },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 16, padding: 14, backgroundColor: Colors.white, borderRadius: 10,
    gap: 8, borderWidth: 1, borderColor: Colors.border,
  },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '600' },
});
