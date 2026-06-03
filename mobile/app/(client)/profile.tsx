import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth';
import { colors } from '@/constants/colors';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const MENU_ITEMS = [
  { icon: 'receipt-outline' as const,    label: 'Meus pedidos',    route: '/orders'    },
  { icon: 'location-outline' as const,   label: 'Endereços',       route: '/addresses' },
  { icon: 'card-outline' as const,       label: 'Formas de pag.',  route: '/payment'   },
  { icon: 'help-circle-outline' as const,label: 'Ajuda',           route: '/help'      },
];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace('/welcome');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Navbar title="Perfil" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Avatar + nome */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name ?? '—'}</Text>
          <Text style={styles.email}>{user?.email ?? '—'}</Text>
          {user?.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.row}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.rowLeft}>
                <Ionicons name={item.icon} size={20} color={colors.accent} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomNav active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1, backgroundColor: colors.background },

  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: colors.white },
  name:       { fontSize: 18, fontWeight: '700', color: colors.white },
  email:      { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  phone:      { fontSize: 13, color: 'rgba(255,255,255,0.5)',  marginTop: 2 },

  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: 12 },
  rowLabel: { fontSize: 14, color: colors.textDark, fontWeight: '500' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8,
    marginTop: 24, marginHorizontal: 16, marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1, borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
});
