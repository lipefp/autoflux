import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { getOrders, Order } from '@/services/api';
import Navbar from '@/components/Navbar';
import StoreBottomNav from '@/components/StoreBottomNav';
import { useAuth } from '@/contexts/auth';

type StatusFilter = 'Todos' | 'aguardando' | 'confirmado' | 'separando' | 'a_caminho' | 'entregue';

const STATUS_FILTERS: StatusFilter[] = ['Todos', 'aguardando', 'confirmado', 'separando', 'a_caminho', 'entregue'];

const STATUS_LABEL: Record<string, string> = {
  aguardando: 'Aguardando',
  confirmado: 'Confirmado',
  separando: 'Separando',
  a_caminho: 'A caminho',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const STATUS_COLOR: Record<string, string> = {
  aguardando: colors.textLight,
  confirmado: '#3B82F6',
  separando: colors.warning,
  a_caminho: colors.accent,
  entregue: colors.success,
  cancelado: colors.danger,
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function StoreOrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('Todos');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const data = await getOrders({ store_id: user?.store_id ?? undefined });
    setOrders(data);
    setLoading(false);
  }, [user?.store_id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = activeFilter === 'Todos'
    ? orders
    : orders.filter(o => o.status === activeFilter);

  const renderItem = ({ item }: { item: Order }) => {
    const itemCount = Array.isArray(item.items) ? item.items.length : 0;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(('/store-order/' + item.id) as any)}
        activeOpacity={0.75}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Pedido #{item.id}</Text>
          <View style={[styles.badge, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
            <Text style={[styles.badgeText, { color: STATUS_COLOR[item.status] }]}>
              {STATUS_LABEL[item.status] ?? item.status}
            </Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardMeta}>{formatDate(item.created_at)}</Text>
          <Text style={styles.cardMeta}>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</Text>
        </View>
        <Text style={styles.cardTotal}>R$ {Number(item.total).toFixed(2).replace('.', ',')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title="Pedidos" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {STATUS_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>
              {f === 'Todos' ? 'Todos' : (STATUS_LABEL[f] ?? f)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
              <Text style={styles.emptySubtext}>Os pedidos aparecerão aqui</Text>
            </View>
          }
        />
      )}
      <StoreBottomNav active="store-orders" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, marginTop: 40 },
  filterBar: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 13, color: colors.textMid, fontWeight: '500' },
  chipTextActive: { color: colors.white, fontWeight: '700' },
  listContent: { padding: 16, paddingBottom: 20 },
  emptyContainer: { flex: 1, padding: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 15, fontWeight: '700', color: colors.textDark },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  cardRow: { flexDirection: 'row', gap: 12 },
  cardMeta: { fontSize: 13, color: colors.textMuted },
  cardTotal: { fontSize: 15, fontWeight: '700', color: colors.accent },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textMuted },
  emptySubtext: { fontSize: 13, color: colors.textLight },
});
