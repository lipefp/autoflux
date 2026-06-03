import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Switch,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Part } from '@/data/mockParts';
import { getPartById } from '@/services/api';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const DELIVERY_FEE = 8.0;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();

  const [part, setPart]       = useState<Part | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [delivery, setDelivery] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      getPartById(id as string).then(data => {
        setPart(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    )
  }

  if (!part) {
    return (
      <View style={styles.container}>
        <Navbar title="Detalhe da peça" showBack />
        <Text style={styles.notFound}>Peça não encontrada.</Text>
      </View>
    );
  }

  function handleAddToCart() {
    addToCart(part!, quantity);
    router.push('/cart' as any);
  }

  const total = part.price * quantity + (delivery ? DELIVERY_FEE : 0);

  return (
    <View style={styles.container}>
      <Navbar
        title="Detalhe da peça"
        showBack
        rightIcon={
          <TouchableOpacity onPress={() => router.push('/cart' as any)}>
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Imagem hero */}
        <View style={styles.heroBox}>
          <Ionicons name="settings-outline" size={52} color={colors.textMuted} />
        </View>

        {/* Cabeçalho da peça */}
        <View style={styles.section}>
          <Text style={styles.partName}>{part.name}</Text>
          <Text style={styles.storeDistance}>{part.store} · {part.distance}</Text>
          <Text style={styles.price}>R$ {part.price.toFixed(2).replace('.', ',')}</Text>
        </View>

        <View style={styles.divider} />

        {/* Informações */}
        <View style={styles.section}>
          <InfoRow label="Compatível com" value={part.compatible} />
          <InfoRow label="Código" value={part.code} />
          <InfoRow label="Estoque" value={`${part.stock} unidades`} />
        </View>

        <View style={styles.divider} />

        {/* Quantidade */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Quantidade</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.min(part.stock, q + 1))}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Switch de entrega */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.fieldLabel}>Entrega em domicílio</Text>
            <Switch
              value={delivery}
              onValueChange={setDelivery}
              trackColor={{ false: colors.border, true: colors.accent + '80' }}
              thumbColor={delivery ? colors.accent : colors.textLight}
            />
          </View>
          {delivery ? (
            <Text style={styles.deliveryInfo}>🚚 Entrega em até 2h · R$ 8,00</Text>
          ) : (
            <Text style={[styles.deliveryInfo, styles.deliveryPickup]}>
              🏪 Retirada na loja · Grátis
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Total e botão */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
            <Text style={styles.addBtnText}>Adicionar ao carrinho</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="cart" />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  value: { fontSize: 13, color: colors.textDark, fontWeight: '500', flexShrink: 1, textAlign: 'right', maxWidth: '60%' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 20 },
  notFound: { textAlign: 'center', marginTop: 60, color: colors.textMuted, fontSize: 15 },

  heroBox: {
    height: 120,
    backgroundColor: colors.imgPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
section: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.white },
  divider: { height: 8, backgroundColor: colors.background },

  partName: { fontSize: 15, fontWeight: '600', color: colors.textDark },
  storeDistance: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  price: { fontSize: 20, fontWeight: '600', color: colors.accent, marginTop: 8 },

  fieldLabel: { fontSize: 14, fontWeight: '500', color: colors.textMid, marginBottom: 8 },

  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  qtyBtnText: { fontSize: 20, color: colors.textDark, fontWeight: '600', lineHeight: 24 },
  qtyValue: { fontSize: 18, fontWeight: '600', color: colors.textDark, minWidth: 28, textAlign: 'center' },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deliveryInfo: { fontSize: 13, color: colors.accent, fontWeight: '500', marginTop: 8 },
  deliveryPickup: { color: '#22C55E' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel: { fontSize: 15, fontWeight: '500', color: colors.textMid },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.accent },

  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },

  cartIcon: { fontSize: 22 },
});
