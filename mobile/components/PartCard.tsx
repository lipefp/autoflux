import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Part } from '@/data/mockParts';
import { useCart } from '@/context/CartContext';
import { colors } from '@/constants/colors';

interface PartCardProps {
  part: Part;
}

export default function PartCard({ part }: PartCardProps) {
  const { addToCart } = useCart();

  function handlePress() {
    router.push({ pathname: '/detail/[id]' as any, params: { id: part.id } });
  }

  function handleAdd() {
    addToCart(part, 1);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.imgBox}>
        <Text style={styles.emoji}>{part.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{part.name}</Text>
        <Text style={styles.store} numberOfLines={1}>{part.store}</Text>
        <Text style={styles.price}>R$ {part.price.toFixed(2).replace('.', ',')}</Text>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={handleAdd} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.imgPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 22 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: colors.textDark },
  store: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  price: { fontSize: 14, fontWeight: '600', color: colors.accent, marginTop: 4 },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addBtnText: { color: colors.white, fontSize: 20, fontWeight: '700', lineHeight: 24 },
});
