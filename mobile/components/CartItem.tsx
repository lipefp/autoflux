import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem as CartItemType, useCart } from '@/context/CartContext';
import { colors } from '@/constants/colors';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity } = useCart();
  const { part, quantity } = item;

  return (
    <View style={styles.card}>
      <View style={styles.imgBox}>
        <Ionicons name="settings-outline" size={22} color={colors.textMuted} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{part.name}</Text>
        <Text style={styles.store} numberOfLines={1}>{part.store}</Text>
        <Text style={styles.price}>R$ {part.price.toFixed(2).replace('.', ',')}</Text>
      </View>

      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(part.id, quantity - 1)}>
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(part.id, quantity + 1)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imgBox: {
    width: 44, height: 44, borderRadius: 8,
    backgroundColor: colors.imgPlaceholder,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: colors.textDark },
  store: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  price: { fontSize: 14, fontWeight: '600', color: colors.accent, marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 6, borderWidth: 1,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background,
  },
  qtyBtnText: { fontSize: 16, color: colors.textDark, fontWeight: '600', lineHeight: 20 },
  qty: { fontSize: 15, fontWeight: '600', color: colors.textDark, minWidth: 20, textAlign: 'center' },
});
