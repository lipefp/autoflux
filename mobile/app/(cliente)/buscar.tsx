import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import api from '@/services/api';

interface Part {
  id: number;
  name: string;
  code: string;
  price: number;
  stock: number;
  brand?: string;
  store: { id: number; name: string; city?: string; avg_rating: number };
}

export default function Buscar() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q || '');
  const [results, setResults] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.q) search(params.q);
  }, []);

  async function search(q?: string) {
    const term = q ?? query;
    if (!term.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/parts', { params: { q: term, limit: 30 } });
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Peças</Text>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Nome da peça ou código..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => search()}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.accent} size="large" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {query ? 'Nenhuma peça encontrada' : 'Digite para buscar'}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.partName}>{item.name}</Text>
                {item.code ? <Text style={styles.partCode}>Cód: {item.code}</Text> : null}
                {item.brand ? <Text style={styles.partCode}>{item.brand}</Text> : null}
                <Text style={styles.storeName}>🏪 {item.store.name}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
                <Text style={[styles.stock, { color: item.stock > 0 ? Colors.success : Colors.error }]}>
                  {item.stock > 0 ? `${item.stock} em estoque` : 'Indisponível'}
                </Text>
                <TouchableOpacity style={styles.addBtn}>
                  <MaterialIcons name="add-shopping-cart" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.white, marginBottom: 12 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 8, paddingHorizontal: 12, gap: 8,
  },
  input: { flex: 1, paddingVertical: 11, fontSize: 15, color: Colors.text },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 40, fontSize: 15 },
  card: {
    backgroundColor: Colors.white, borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    elevation: 1, borderWidth: 1, borderColor: Colors.border,
  },
  partName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  partCode: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  storeName: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  right: { alignItems: 'flex-end', gap: 6 },
  price: { fontSize: 16, fontWeight: '700', color: Colors.accent },
  stock: { fontSize: 11 },
  addBtn: {
    backgroundColor: Colors.accent, width: 32, height: 32,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
});
