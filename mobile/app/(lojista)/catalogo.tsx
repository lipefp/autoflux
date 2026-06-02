import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import api from '@/services/api';

interface Part {
  id: number;
  name: string;
  code?: string;
  price: number;
  stock: number;
  is_active: boolean;
}

export default function Catalogo() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/parts/mine').then((r) => setParts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.accent} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Catálogo</Text>
        <TouchableOpacity style={styles.addBtn}>
          <MaterialIcons name="add" size={22} color={Colors.white} />
          <Text style={styles.addText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={parts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma peça cadastrada</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              {item.code ? <Text style={styles.code}>Cód: {item.code}</Text> : null}
              <Text style={[styles.status, { color: item.is_active ? Colors.success : Colors.error }]}>
                {item.is_active ? 'Ativo' : 'Inativo'}
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
              <Text style={styles.stock}>{item.stock} un.</Text>
              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 20,
    paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.white },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, gap: 4,
  },
  addText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 40 },
  card: {
    backgroundColor: Colors.white, borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center', elevation: 1, borderWidth: 1, borderColor: Colors.border,
  },
  name: { fontSize: 15, fontWeight: '600', color: Colors.text },
  code: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  status: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  right: { alignItems: 'flex-end', gap: 6 },
  price: { fontSize: 15, fontWeight: '700', color: Colors.accent },
  stock: { fontSize: 12, color: Colors.textMuted },
});
