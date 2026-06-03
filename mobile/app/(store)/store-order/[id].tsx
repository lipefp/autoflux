import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { getOrderById, updateOrderStatus, Order } from '@/services/api';
import Navbar from '@/components/Navbar';
import StoreBottomNav from '@/components/StoreBottomNav';

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

const NEXT_STATUS: Record<string, string | null> = {
  aguardando: 'confirmado',
  confirmado: 'separando',
  separando: 'a_caminho',
  a_caminho: 'entregue',
  entregue: null,
};

const NEXT_LABEL: Record<string, string> = {
  aguardando: 'Confirmar pedido',
  confirmado: 'Iniciar separação',
  separando: 'Enviar para entrega',
  a_caminho: 'Marcar como entregue',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function StoreOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const data = await getOrderById(id);
    setOrder(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleAdvanceStatus = async () => {
    if (!order) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setAdvancing(true);
    const updated = await updateOrderStatus(String(order.id), next);
    if (updated) {
      setOrder(updated);
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
    setAdvancing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar title={`Pedido #${id}`} showBack />
        <ActivityIndicator color={colors.accent} style={styles.loader} />
        <StoreBottomNav active="store-orders" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar title={`Pedido #${id}`} showBack />
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Pedido não encontrado</Text>
        </View>
        <StoreBottomNav active="store-orders" />
      </SafeAreaView>
    );
  }

  const statusColor = STATUS_COLOR[order.status] ?? colors.textMuted;
  const nextLabel = NEXT_LABEL[order.status] ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title={`Pedido #${order.id}`} showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>
            {STATUS_LABEL[order.status] ?? order.status}
          </Text>
        </View>

        <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do pedido</Text>
          {Array.isArray(order.items) && order.items.map((item, idx) => {
            const subtotal = Number(item.price) * Number(item.quantity);
            return (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemQty}>{item.quantity}x R$ {Number(item.price).toFixed(2).replace('.', ',')}</Text>
                </View>
                <Text style={styles.itemSubtotal}>
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            );
          })}
        </View>

        {!!order.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço de entrega</Text>
            <Text style={styles.addressText}>{order.address}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>R$ {Number(order.subtotal).toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Entrega</Text>
            <Text style={styles.totalValue}>R$ {Number(order.delivery_fee).toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalLabelFinal}>Total</Text>
            <Text style={styles.totalValueFinal}>R$ {Number(order.total).toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>

        {nextLabel && (
          <TouchableOpacity
            style={[styles.advanceBtn, advancing && styles.advanceBtnDisabled]}
            onPress={handleAdvanceStatus}
            disabled={advancing}
          >
            {advancing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.advanceBtnText}>{nextLabel}</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
      <StoreBottomNav active="store-orders" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, marginTop: 40 },
  content: { padding: 16, paddingBottom: 40 },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 6,
  },
  statusBadgeText: { fontSize: 15, fontWeight: '700' },
  dateText: { fontSize: 13, color: colors.textMuted, marginBottom: 20 },
  section: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, fontWeight: '600', color: colors.textDark },
  itemQty: { fontSize: 12, color: colors.textMuted },
  itemSubtotal: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  addressText: { fontSize: 14, color: colors.textMid, lineHeight: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 2,
  },
  totalLabel: { fontSize: 14, color: colors.textMuted },
  totalValue: { fontSize: 14, color: colors.textDark },
  totalLabelFinal: { fontSize: 15, fontWeight: '700', color: colors.textDark },
  totalValueFinal: { fontSize: 16, fontWeight: '800', color: colors.accent },
  advanceBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  advanceBtnDisabled: { opacity: 0.6 },
  advanceBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: colors.textMuted },
});
