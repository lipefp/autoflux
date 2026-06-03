import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth';
import { getStoreMetrics, getOrders, Order } from '@/services/api';
import { colors } from '@/constants/colors';
import StoreBottomNav from '@/components/StoreBottomNav';

export default function StoreDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ orders_today: 0, revenue_today: 0, pending_orders: 0, parts_count: 0, rating: 5 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.store_id) return;
    Promise.all([
      getStoreMetrics(user.store_id),
      getOrders({ store_id: user.store_id }),
    ]).then(([m, orders]) => {
      setMetrics(m as any);
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    });
  }, [user?.store_id]);

  const METRIC_CARDS = [
    { icon: 'receipt-outline' as const,  label: 'Pedidos hoje',     value: String(metrics.orders_today),         color: colors.accent },
    { icon: 'time-outline' as const,     label: 'Aguardando',       value: String(metrics.pending_orders),       color: '#F59E0B' },
    { icon: 'cash-outline' as const,     label: 'Faturamento hoje', value: `R$ ${metrics.revenue_today.toFixed(2).replace('.', ',')}`, color: '#22C55E' },
    { icon: 'cube-outline' as const,     label: 'Pecas ativas',     value: String(metrics.parts_count),          color: '#3B82F6' },
  ];

  const STATUS_LABEL: Record<string, string> = {
    aguardando: 'Aguardando', confirmado: 'Confirmado', separando: 'Separando',
    a_caminho: 'A caminho', entregue: 'Entregue', cancelado: 'Cancelado',
  };
  const STATUS_COLOR: Record<string, string> = {
    aguardando: colors.textLight, confirmado: '#3B82F6', separando: '#F59E0B',
    a_caminho: colors.accent, entregue: '#22C55E', cancelado: '#EF4444',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Ola, {user?.name?.split(' ')[0]}</Text>
            <Text style={styles.headerSub}>Painel da loja</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} size="large" />
        ) : (
          <>
            <View style={styles.grid}>
              {METRIC_CARDS.map((card) => (
                <View key={card.label} style={styles.card}>
                  <View style={[styles.iconBox, { backgroundColor: card.color + '22' }]}>
                    <Ionicons name={card.icon} size={24} color={card.color} />
                  </View>
                  <Text style={styles.cardValue}>{card.value}</Text>
                  <Text style={styles.cardLabel}>{card.label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Acoes rapidas</Text>
            <View style={styles.shortcuts}>
              <Shortcut icon="cube-outline" label="Catalogo"    onPress={() => router.push('/catalog')} />
              <Shortcut icon="receipt-outline" label="Pedidos"  onPress={() => router.push('/store-orders')} />
              <Shortcut icon="person-outline" label="Perfil"    onPress={() => router.push('/store-profile')} />
            </View>

            {recentOrders.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Ultimos pedidos</Text>
                {recentOrders.map(order => (
                  <TouchableOpacity key={order.id} style={styles.orderRow} onPress={() => router.push('/store-order/' + order.id as any)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.orderNum}>Pedido #{order.id}</Text>
                      <Text style={styles.orderTotal}>R$ {Number(order.total).toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: (STATUS_COLOR[order.status] || colors.textLight) + '22' }]}>
                      <Text style={[styles.badgeText, { color: STATUS_COLOR[order.status] || colors.textLight }]}>
                        {STATUS_LABEL[order.status] || order.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
      <StoreBottomNav active="dashboard" />
    </SafeAreaView>
  );
}

function Shortcut({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={shortcutStyles.btn} onPress={onPress}>
      <View style={shortcutStyles.iconWrap}>
        <Ionicons name={icon} size={26} color={colors.accent} />
      </View>
      <Text style={shortcutStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const shortcutStyles = StyleSheet.create({
  btn: { alignItems: 'center', flex: 1 },
  iconWrap: {
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border, marginBottom: 6, elevation: 1,
  },
  label: { fontSize: 12, color: colors.textMid, fontWeight: '500', textAlign: 'center' },
});

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 16, gap: 12 },
  card: {
    backgroundColor: colors.white, borderRadius: 14, padding: 16,
    width: '47%', borderWidth: 1, borderColor: colors.border, elevation: 1,
  },
  iconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardValue: { fontSize: 20, fontWeight: '800', color: colors.textDark },
  cardLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textDark, marginHorizontal: 16, marginTop: 24, marginBottom: 14 },
  shortcuts: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, justifyContent: 'space-between' },

  orderRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, marginHorizontal: 16, marginBottom: 8,
    padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
  },
  orderNum: { fontSize: 14, fontWeight: '600', color: colors.textDark },
  orderTotal: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
});
