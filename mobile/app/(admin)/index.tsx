import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import api from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { icon: 'people' as const, label: 'Clientes', value: stats.total_clients, color: '#3B82F6' },
        { icon: 'store' as const, label: 'Lojas ativas', value: stats.total_stores, color: Colors.success },
        { icon: 'pending' as const, label: 'Lojas pendentes', value: stats.pending_stores, color: '#F59E0B' },
        { icon: 'shopping-cart' as const, label: 'Pedidos hoje', value: stats.orders_today, color: Colors.accent },
        { icon: 'attach-money' as const, label: 'Volume hoje', value: `R$ ${(stats.revenue_today || 0).toFixed(2)}`, color: '#8B5CF6' },
        { icon: 'inventory-2' as const, label: 'Peças cadastradas', value: stats.total_parts, color: '#06B6D4' },
      ]
    : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Admin</Text>
        <Text style={styles.sub}>Métricas gerais da plataforma</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.label} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: card.color + '20' }]}>
                <MaterialIcons name={card.icon} size={24} color={card.color} />
              </View>
              <Text style={styles.value}>{card.value}</Text>
              <Text style={styles.label}>{card.label}</Text>
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
  title: { fontSize: 22, fontWeight: '700', color: Colors.white },
  sub: { fontSize: 14, color: Colors.white, opacity: 0.75, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  card: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 16, width: '47%',
    elevation: 1, borderWidth: 1, borderColor: Colors.border,
  },
  iconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  value: { fontSize: 20, fontWeight: '800', color: Colors.text },
  label: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});
