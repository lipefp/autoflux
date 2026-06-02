import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import api from '@/services/api';

const STATUS_FLOW: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'shipped',
  shipped: 'delivered',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente', confirmed: 'Confirmado', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', confirmed: '#3B82F6', preparing: '#8B5CF6',
  shipped: '#06B6D4', delivered: Colors.success, cancelled: Colors.error,
};

export default function LojistaPedidos() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const res = await api.get('/orders/store');
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function advanceStatus(orderId: number, currentStatus: string) {
    const next = STATUS_FLOW[currentStatus];
    if (!next) return;
    try {
      await api.patch(`/orders/${orderId}/status`, { status: next });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: next } : o));
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.accent} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum pedido recebido</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.orderId}>Pedido #{item.id}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
                <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status] }]}>
                  {STATUS_LABELS[item.status]}
                </Text>
              </View>
            </View>
            <Text style={styles.client}>Cliente: {item.client?.name}</Text>
            <Text style={styles.total}>Total: R$ {item.total?.toFixed(2)}</Text>
            {STATUS_FLOW[item.status] && (
              <TouchableOpacity style={styles.advanceBtn} onPress={() => advanceStatus(item.id, item.status)}>
                <Text style={styles.advanceBtnText}>
                  Avançar → {STATUS_LABELS[STATUS_FLOW[item.status]]}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.white },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 40 },
  card: { backgroundColor: Colors.white, borderRadius: 10, padding: 16, elevation: 1, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 15, fontWeight: '700', color: Colors.text },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  client: { fontSize: 13, color: Colors.textMuted, marginBottom: 4 },
  total: { fontSize: 15, fontWeight: '600', color: Colors.accent, marginBottom: 12 },
  advanceBtn: { backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  advanceBtnText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
});
