import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { getStores, Store } from '@/services/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export default function StoresScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores().then(data => {
      setStores(data);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Navbar title="Lojas" />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : (
          <FlatList
            data={stores}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <StoreCard store={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhuma loja disponível</Text>
            }
          />
        )}
      </SafeAreaView>
      <BottomNav active="stores" />
    </View>
  );
}

function StoreCard({ store }: { store: Store }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(('/store/' + store.id) as any)}
      activeOpacity={0.75}
    >
      <Text style={styles.storeName}>{store.name}</Text>
      <View style={styles.row}>
        {store.city ? <Text style={styles.meta}>{store.city}</Text> : null}
        {store.city && store.distance ? <Text style={styles.sep}> · </Text> : null}
        {store.distance ? <Text style={styles.meta}>{store.distance}</Text> : null}
      </View>
      <View style={styles.footerRow}>
        {store.rating != null && (
          <Text style={styles.rating}>
            <Text style={styles.star}>★ </Text>
            {store.rating.toFixed(1)}
          </Text>
        )}
        {store.hours ? <Text style={styles.hours}>{store.hours}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safeArea: { flex: 1 },
  loader: { marginTop: 40 },
  listContent: { paddingVertical: 8, paddingBottom: 16 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 6,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  meta: { fontSize: 13, color: colors.textMuted },
  sep: { fontSize: 13, color: colors.textMuted },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: { fontSize: 13, color: colors.textMid, fontWeight: '600' },
  star: { color: colors.accent },
  hours: { fontSize: 12, color: colors.textLight },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
    fontSize: 15,
  },
});
