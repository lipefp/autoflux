import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';

const CATEGORIES = [
  { id: 'motor', icon: 'settings' as const, label: 'Motor' },
  { id: 'freios', icon: 'stop-circle' as const, label: 'Freios' },
  { id: 'suspensao', icon: 'directions-car' as const, label: 'Suspensão' },
  { id: 'eletrica', icon: 'electric-bolt' as const, label: 'Elétrica' },
  { id: 'filtros', icon: 'filter-alt' as const, label: 'Filtros' },
];

export default function ClienteHome() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  function handleSearch() {
    if (search.trim()) router.push({ pathname: '/(cliente)/buscar', params: { q: search } });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
        <Text style={styles.subGreeting}>Encontre a peça que precisa</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por peça ou código..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Buscar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Categorias</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => router.push({ pathname: '/(cliente)/buscar', params: { categoria: cat.id } })}
          >
            <View style={styles.categoryIcon}>
              <MaterialIcons name={cat.icon} size={24} color={Colors.accent} />
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bannerCard}>
        <Text style={styles.bannerTitle}>Busque por veículo</Text>
        <Text style={styles.bannerSubtitle}>Encontre peças compatíveis com seu carro</Text>
        <TouchableOpacity
          style={styles.bannerBtn}
          onPress={() => router.push({ pathname: '/(cliente)/buscar', params: { modo: 'veiculo' } })}
        >
          <Text style={styles.bannerBtnText}>Selecionar veículo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary, paddingTop: 60,
    paddingBottom: 24, paddingHorizontal: 20,
  },
  greeting: { fontSize: 22, fontWeight: '700', color: Colors.white },
  subGreeting: { fontSize: 14, color: Colors.white, opacity: 0.75, marginTop: 2 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', margin: 16,
    backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: Colors.border, elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.text },
  searchBtn: { backgroundColor: Colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  searchBtnText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginHorizontal: 16, marginBottom: 12 },
  categoriesRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  categoryCard: { alignItems: 'center', width: 72 },
  categoryIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', elevation: 2,
    borderWidth: 1, borderColor: Colors.border,
  },
  categoryLabel: { fontSize: 12, color: Colors.text, marginTop: 6, textAlign: 'center' },
  bannerCard: { margin: 16, marginTop: 24, backgroundColor: Colors.primary, borderRadius: 12, padding: 20 },
  bannerTitle: { fontSize: 18, fontWeight: '700', color: Colors.white },
  bannerSubtitle: { fontSize: 13, color: Colors.white, opacity: 0.75, marginTop: 4, marginBottom: 16 },
  bannerBtn: {
    backgroundColor: Colors.accent, paddingVertical: 10,
    paddingHorizontal: 18, borderRadius: 8, alignSelf: 'flex-start',
  },
  bannerBtnText: { color: Colors.white, fontWeight: '600' },
});
