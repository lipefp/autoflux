import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '@/constants/colors';
import { brands, Part } from '@/data/mockParts';
import { getParts } from '@/services/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import PartCard from '@/components/PartCard';
import { useCart } from '@/context/CartContext';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name'

export default function HomeScreen() {
  const [parts, setParts]                     = useState<Part[]>([])
  const [loading, setLoading]                 = useState(true)
  const [selectedBrand, setSelectedBrand]     = useState('Todas')
  const [searchQuery, setSearchQuery]         = useState('')
  const [sortBy, setSortBy]                   = useState<SortOption>('default')
  const { items } = useCart();

  const loadParts = useCallback(async () => {
    setLoading(true)
    const data = await getParts(selectedBrand, searchQuery)
    let result = [...data]
    if (sortBy === 'price_asc')  result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'name')       result.sort((a, b) => a.name.localeCompare(b.name))
    setParts(result)
    setLoading(false)
  }, [selectedBrand, searchQuery, sortBy])

  useEffect(() => { loadParts() }, [loadParts])

  return (
    <View style={styles.container}>
      <Navbar
        rightIcon={
          <View>
            <Text style={styles.bellIcon}>🔔</Text>
          </View>
        }
      />

      <FlatList
        data={parts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PartCard part={item} />}
        ListHeaderComponent={
          <View>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            {/* Picker de marca — requisito acadêmico */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.sectionLabel}>Filtrar por marca</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={selectedBrand}
                  onValueChange={(val) => setSelectedBrand(val)}
                  style={styles.picker}
                  dropdownIconColor={colors.accent}
                >
                  {brands.map((b) => (
                    <Picker.Item key={b} label={b} value={b} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Chips de marca sincronizados com o Picker */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {brands.map((b) => {
                const active = selectedBrand === b;
                return (
                  <TouchableOpacity
                    key={b}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setSelectedBrand(b)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {b}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.sectionLabel}>
              Peças disponíveis{parts.length > 0 ? ` (${parts.length})` : ''}
            </Text>

            {loading && <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />}
          </View>
        }
        ListEmptyComponent={
          loading ? null : <Text style={styles.empty}>Nenhuma peça encontrada.</Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bellIcon: { fontSize: 22 },
  pickerWrapper: { paddingHorizontal: 16, marginTop: 12 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMid,
    marginBottom: 6,
  },
  pickerBox: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  picker: { color: colors.textDark, height: 48 },
  chipsRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
    paddingTop: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  listContent: { paddingTop: 8, paddingBottom: 12 },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
    fontSize: 15,
  },
});
