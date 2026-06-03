import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { getOrders, Order } from '@/services/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  aguardando: { bg: '#F5F5F5',  text: colors.textLight,  label: 'Aguardando'  },
  confirmado: { bg: '#EFF6FF',  text: '#3B82F6',          label: 'Confirmado'  },
  separando:  { bg: '#FFFBEB',  text: '#F59E0B',          label: 'Separando'   },
  a_caminho:  { bg: '#FFF4EC',  text: colors.accent,      label: 'A caminho'   },
  entregue:   { bg: '#F0FDF4',  text: '#22C55E',          label: 'Entregue'    },
  cancelado:  { bg: '#FEF2F2',  text: '#EF4444',          label: 'Cancelado'   },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_COLORS[status] ?? STATUS_COLORS['aguardando'];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

function OrderCard({ item }: { item: Order }) {
  const qty = item.items.reduce((s, i) => s + i.quantity, 0);
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(('/order/' + item.id) as any)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.storeName}>{item.store_name ?? item.store ?? 'Loja'}</Text>
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.itemsText}>
        {qty} {qty === 1 ? 'item' : 'itens'}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        <Text style={styles.total}>
          R$ {item.total.toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={56} color={colors.textLight} />
      <Text style={styles.emptyText}>Nenhum pedido ainda</Text>
    </View>
  );
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Navbar title="Meus Pedidos" showBack />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <OrderCard item={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState />}
        />
      )}
      <BottomNav active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemsText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  total: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
