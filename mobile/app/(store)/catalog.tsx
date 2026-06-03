import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { getParts, deletePart, Part } from '@/services/api';
import Navbar from '@/components/Navbar';
import StoreBottomNav from '@/components/StoreBottomNav';
import { useAuth } from '@/contexts/auth';

export default function CatalogScreen() {
  const { user } = useAuth();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  const loadParts = useCallback(async () => {
    setLoading(true);
    const data = await getParts(undefined, undefined, user?.store_id ?? undefined);
    setParts(data);
    setLoading(false);
  }, [user?.store_id]);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Excluir peça',
      `Deseja excluir "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deletePart(id);
            loadParts();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Part }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.partName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.partPrice}>R$ {Number(item.price).toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.partBrand}>{item.brand}</Text>
        <Text style={[styles.partStock, { color: item.stock > 0 ? colors.success : colors.danger }]}>
          {item.stock > 0 ? `${item.stock} em estoque` : 'Sem estoque'}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(('/part-form/' + item.id) as any)}
        >
          <Ionicons name="pencil-outline" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(String(item.id), item.name)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title="Catálogo" />
      {loading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={parts}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={parts.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color={colors.textLight} />
              <Text style={styles.emptyText}>Nenhuma peça cadastrada</Text>
              <Text style={styles.emptySubtext}>Toque em "+ Nova peça" para começar</Text>
            </View>
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/part-form' as any)}
      >
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>Nova peça</Text>
      </TouchableOpacity>
      <StoreBottomNav active="catalog" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: 'center', marginTop: 40 },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1, padding: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardInfo: { flex: 1, gap: 2 },
  partName: { fontSize: 15, fontWeight: '600', color: colors.textDark },
  partPrice: { fontSize: 15, fontWeight: '700', color: colors.accent },
  partBrand: { fontSize: 13, color: colors.textMuted },
  partStock: { fontSize: 12, fontWeight: '500' },
  cardActions: { flexDirection: 'row', gap: 8, marginLeft: 12 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textMuted },
  emptySubtext: { fontSize: 13, color: colors.textLight },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: colors.accent,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
