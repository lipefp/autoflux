import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  Alert, StyleSheet,
} from 'react-native';
import { colors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import CartItemComponent from '@/components/CartItem';

const DELIVERY_FEE = 8.0;

export default function CartScreen() {
  const { items, total } = useCart();

  const isEmpty = items.length === 0;
  const grandTotal = total + (isEmpty ? 0 : DELIVERY_FEE);

  function handleFinalize() {
    Alert.alert(
      'Pedido finalizado!',
      'Seu pedido foi enviado com sucesso.',
      [{ text: 'OK' }]
    );
  }

  return (
    <View style={styles.container}>
      <Navbar
        title="Carrinho"
        showBack
        rightIcon={
          <Text style={styles.trashIcon}>🗑️</Text>
        }
      />

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          <Text style={styles.emptySubText}>Adicione peças para começar</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.part.id}
          renderItem={({ item }) => <CartItemComponent item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View>
              {/* Resumo */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    R$ {total.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Entrega</Text>
                  <Text style={styles.summaryValue}>
                    R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>

              {/* Botão finalizar */}
              <TouchableOpacity style={styles.finalizeBtn} onPress={handleFinalize}>
                <Text style={styles.finalizeBtnText}>Finalizar pedido</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <BottomNav active="cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.textDark, marginBottom: 6 },
  emptySubText: { fontSize: 14, color: colors.textMuted },

  listContent: { paddingTop: 12, paddingBottom: 24 },

  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  summaryValue: { fontSize: 14, color: colors.textDark, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  totalLabel: { fontSize: 15, fontWeight: '600', color: colors.textDark },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.accent },

  finalizeBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
  },
  finalizeBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },

  trashIcon: { fontSize: 22 },
});
