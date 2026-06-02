import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';

const MENU_ITEMS = [
  'Dados da loja',
  'Área de entrega',
  'Horário de funcionamento',
  'Pagamentos',
  'Configurações',
];

export default function LojistaPerfil() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialIcons name="store" size={36} color={Colors.white} />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        {MENU_ITEMS.map((label) => (
          <TouchableOpacity key={label} style={styles.menuItem}>
            <Text style={styles.menuLabel}>{label}</Text>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
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
  name: { fontSize: 20, fontWeight: '700', color: Colors.white },
  email: { fontSize: 13, color: Colors.white, opacity: 0.75, marginTop: 2 },
  section: {
    margin: 16, backgroundColor: Colors.white, borderRadius: 10,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuLabel: { fontSize: 15, color: Colors.text },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 16, padding: 14, backgroundColor: Colors.white, borderRadius: 10,
    gap: 8, borderWidth: 1, borderColor: Colors.border,
  },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '600' },
});
