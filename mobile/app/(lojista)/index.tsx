import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import api from '@/services/api';

interface Stats {
  total_orders: number;
  pending_orders: number;
  revenue_today: number;
  total_parts: number;
}

export default function LojistaDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stores/me/stats')
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { icon: 'receipt-long' as const, label: 'Pedidos hoje', value: String(stats.total_orders), color: Colors.accent },
        { icon: 'pending' as const, label: 'Aguardando', value: String(stats.pending_orders), color: '#F59E0B' },
        { icon: 'attach-money' as const, label: 'Faturamento hoje', value: `R$ ${stats.revenue_today.toFixed(2)}`, color: Colors.success },
        { icon: 'inventory' as const, label: 'Peças ativas', value: String(stats.total_parts), color: '#3B82F6' },
      ]
    : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}</Text>
        <Text style={styles.sub}>Visão geral da sua loja</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} size="large" />
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.label} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: card.color + '20' }]}>
                <MaterialIcons name={card.icon} size={24} color={card.color} />
              </View>
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: Colors.white },
  sub: { fontSize: 14, color: Colors.white, opacity: 0.75, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  card: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 16, width: '47%',
    elevation: 1, borderWidth: 1, borderColor: Colors.border,
  },
  iconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  cardLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});
