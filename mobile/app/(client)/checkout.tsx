import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const DELIVERY_FEE = 8;

export default function CheckoutScreen() {
  const { items, total, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [delivery, setDelivery] = useState(true);

  const subtotal = total;
  const deliveryFee = delivery ? DELIVERY_FEE : 0;
  const orderTotal = subtotal + deliveryFee;

  async function handleConfirm() {
    const order = await createOrder({
      items: items.map((i) => ({
        partId: i.part.id,
        name: i.part.name,
        price: i.part.price,
        quantity: i.quantity,
      })),
      subtotal,
      delivery_fee: deliveryFee,
      total: orderTotal,
      delivery,
      address,
    });

    if (order) {
      clearCart();
      router.replace({
        pathname: '/order-success',
        params: { orderId: String(order.id), total: String(order.total) },
      });
    } else {
      Alert.alert('Erro', 'Não foi possível finalizar o pedido. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Navbar title="Checkout" showBack />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de entrega</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua, número, bairro..."
            placeholderTextColor={colors.textLight}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de recebimento</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, delivery && styles.toggleActive]}
              onPress={() => setDelivery(true)}
            >
              <Text style={[styles.toggleText, delivery && styles.toggleTextActive]}>
                Entrega
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !delivery && styles.toggleActive]}
              onPress={() => setDelivery(false)}
            >
              <Text style={[styles.toggleText, !delivery && styles.toggleTextActive]}>
                Retirada
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do pedido</Text>
          {items.map((item) => (
            <View key={item.part.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.part.name}{' '}
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </Text>
              <Text style={styles.itemPrice}>
                R$ {(item.part.price * item.quantity).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de entrega</Text>
            <Text style={styles.summaryValue}>
              {delivery ? `R$ ${DELIVERY_FEE.toFixed(2).replace('.', ',')}` : 'Grátis'}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R$ {orderTotal.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, !address.trim() && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!address.trim()}
        >
          <Text style={styles.confirmBtnText}>Confirmar pedido</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav active="cart" />
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
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textDark,
    backgroundColor: colors.background,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  toggleActive: {
    borderColor: colors.accent,
    backgroundColor: '#FFF4EC',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  toggleTextActive: {
    color: colors.accent,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemName: {
    fontSize: 13,
    color: colors.textMid,
    flex: 1,
    marginRight: 8,
  },
  itemQty: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
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
  confirmBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  confirmBtnDisabled: {
    opacity: 0.4,
  },
  confirmBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
