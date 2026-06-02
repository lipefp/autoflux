import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import api from '@/services/api';

interface PendingStore {
  id: number;
  name: string;
  cnpj?: string;
  city?: string;
  state?: string;
  owner: { name: string; email: string };
  created_at: string;
}

export default function Aprovacoes() {
  const [stores, setStores] = useState<PendingStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPending(); }, []);

  async function fetchPending() {
    try {
      const res = await api.get('/admin/stores/pending');
      setStores(res.data);
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: number) {
    try {
      await api.patch(`/admin/stores/${id}/approve`);
      setStores((prev) => prev.filter((s) => s.id !== id));
      Alert.alert('Sucesso', 'Loja aprovada!');
    } catch {
      Alert.alert('Erro', 'Não foi possível aprovar a loja.');
    }
  }

  async function reject(id: number) {
    try {
      await api.patch(`/admin/stores/${id}/reject`);
      setStores((prev) => prev.filter((s) => s.id !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível rejeitar a loja.');
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.accent} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aprovações</Text>
        <Text style={styles.count}>{stores.length} pendente{stores.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma loja aguardando aprovação</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.storeIcon}>
              <MaterialIcons name="store" size={24} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{item.name}</Text>
              {item.cnpj ? <Text style={styles.storeMeta}>CNPJ: {item.cnpj}</Text> : null}
              {item.city ? <Text style={styles.storeMeta}>{item.city}{item.state ? ` - ${item.state}` : ''}</Text> : null}
              <Text style={styles.ownerName}>Dono: {item.owner?.name}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.approveBtn} onPress={() => approve(item.id)}>
                <MaterialIcons name="check" size={18} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => reject(item.id)}>
                <MaterialIcons name="close" size={18} color={Colors.white} />
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
  count: { fontSize: 14, color: Colors.white, opacity: 0.75 },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 40 },
  card: {
    backgroundColor: Colors.white, borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    elevation: 1, borderWidth: 1, borderColor: Colors.border,
  },
  storeIcon: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: Colors.accent + '15', alignItems: 'center', justifyContent: 'center',
  },
  storeName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  storeMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  ownerName: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  actions: { gap: 8 },
  approveBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
});
