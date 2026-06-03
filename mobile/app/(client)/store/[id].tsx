import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { getStoreById, getParts, Store, Part } from '@/services/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export default function StoreCatalogScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store, setStore] = useState<Store | undefined>(undefined);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getStoreById(id as string),
      getParts(undefined, undefined, id as string),
    ]).then(([storeData, partsData]) => {
      setStore(storeData);
      setParts(partsData);
      setLoading(false);
    });
  }, [id]);

  return (
    <View style={styles.container}>
      <Navbar title={store?.name || 'Loja'} showBack />
      {loading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={parts}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <PartRow part={item} />}
          ListHeaderComponent={store ? <StoreHeader store={store} /> : null}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma peça disponível</Text>
          }
        />
      )}
      <BottomNav active="stores" />
    </View>
  );
}

function StoreHeader({ store }: { store: Store }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerName}>{store.name}</Text>
      <View style={styles.headerRow}>
        {store.rating != null && (
          <Text style={styles.headerRating}>
            <Text style={styles.star}>★ </Text>
            {store.rating.toFixed(1)}
            {store.total_reviews != null ? ` (${store.total_reviews})` : ''}
          </Text>
        )}
        {store.hours ? (
          <Text style={styles.headerMeta}>{store.hours}</Text>
        ) : null}
      </View>
      {store.city ? <Text style={styles.headerCity}>{store.city}</Text> : null}
      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>Peças disponíveis</Text>
    </View>
  );
}

function PartRow({ part }: { part: Part }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(('/detail/' + part.id) as any)}
      activeOpacity={0.75}
    >
      <View style={styles.cardTop}>
        <Text style={styles.partName} numberOfLines={2}>{part.name}</Text>
        <Text style={styles.partPrice}>
          R$ {part.price.toFixed(2).replace('.', ',')}
        </Text>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.partBrand}>{part.brand}</Text>
        <Text style={[styles.partStock, part.stock === 0 && styles.outOfStock]}>
          {part.stock > 0 ? `${part.stock} em estoque` : 'Sem estoque'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: 40 },
  listContent: { paddingBottom: 16 },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 4,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerRating: { fontSize: 13, fontWeight: '600', color: colors.textMid },
  star: { color: colors.accent },
  headerMeta: { fontSize: 13, color: colors.textMuted },
  headerCity: { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMid,
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 8,
    marginVertical: 5,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  partName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  partPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partBrand: { fontSize: 12, color: colors.textMuted },
  partStock: { fontSize: 12, color: colors.success, fontWeight: '500' },
  outOfStock: { color: colors.textLight },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
    fontSize: 15,
  },
});
