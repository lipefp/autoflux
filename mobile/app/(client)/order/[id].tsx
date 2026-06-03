import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { getOrderById, Order } from '@/services/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const STATUS_STEPS = [
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'confirmado', label: 'Confirmado' },
  { key: 'separando',  label: 'Separando'  },
  { key: 'a_caminho',  label: 'A caminho'  },
  { key: 'entregue',   label: 'Entregue'   },
] as const;

const STATUS_COLORS: Record<string, string> = {
  aguardando: colors.textLight,
  confirmado: '#3B82F6',
  separando:  '#F59E0B',
  a_caminho:  colors.accent,
  entregue:   '#22C55E',
  cancelado:  '#EF4444',
};

function getStepIndex(status: string) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrderById(id).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Navbar title={`Pedido #${id}`} showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
        <BottomNav active="profile" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <Navbar title={`Pedido #${id}`} showBack />
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>Pedido não encontrado.</Text>
        </View>
        <BottomNav active="profile" />
      </SafeAreaView>
    );
  }

  const activeIndex = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelado';

  return (
    <SafeAreaView style={styles.safe}>
      <Navbar title={`Pedido #${order.id}`} showBack />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status do pedido</Text>
          {isCancelled ? (
            <View style={styles.cancelledRow}>
              <Ionicons name="close-circle" size={20} color="#EF4444" />
              <Text style={[styles.cancelledText, { color: '#EF4444' }]}>Pedido cancelado</Text>
            </View>
          ) : (
            STATUS_STEPS.map((step, index) => {
              const isActive = index <= activeIndex;
              const isLast = index === STATUS_STEPS.length - 1;
              const dotColor = isActive ? STATUS_COLORS[step.key] ?? colors.accent : colors.border;
              return (
                <View key={step.key} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.dot,
                        isActive
                          ? { backgroundColor: dotColor, borderColor: dotColor }
                          : { backgroundColor: colors.white, borderColor: colors.border },
                      ]}
                    />
                    {!isLast && (
                      <View
                        style={[
                          styles.line,
                          { backgroundColor: index < activeIndex ? dotColor : colors.border },
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive ? { color: colors.textDark, fontWeight: '600' } : { color: colors.textLight },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do pedido</Text>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {order.address ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço de entrega</Text>
            <Text style={styles.addressText}>{order.address}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              R$ {order.subtotal.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Entrega</Text>
            <Text style={styles.summaryValue}>
              {order.delivery_fee > 0
                ? `R$ ${order.delivery_fee.toFixed(2).replace('.', ',')}`
                : 'Grátis'}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R$ {order.total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <Text style={styles.dateText}>
          Pedido realizado em {formatDate(order.created_at)}
        </Text>

        {order.status === 'entregue' && (
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() => router.push(('/review/' + id) as any)}
          >
            <Ionicons name="star-outline" size={18} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.reviewBtnText}>Avaliar loja</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <BottomNav active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cancelledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelledText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginTop: 2,
  },
  line: {
    width: 2,
    height: 28,
    marginTop: 2,
  },
  stepLabel: {
    fontSize: 14,
    paddingBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemName: {
    fontSize: 13,
    color: colors.textMid,
    flex: 1,
    marginRight: 8,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemQty: {
    fontSize: 12,
    color: colors.textMuted,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  addressText: {
    fontSize: 14,
    color: colors.textMid,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    color: colors.textMid,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  dateText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  reviewBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  reviewBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
