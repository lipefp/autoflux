import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

const SUCCESS = '#22C55E';

export default function OrderSuccessScreen() {
  const { orderId, total } = useLocalSearchParams<{ orderId: string; total: string }>();

  const formattedTotal = total
    ? `R$ ${parseFloat(total).toFixed(2).replace('.', ',')}`
    : '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark-circle" size={80} color={SUCCESS} />
        </View>
        <Text style={styles.title}>Pedido confirmado!</Text>
        {orderId ? <Text style={styles.orderId}>Pedido #{orderId}</Text> : null}
        {formattedTotal ? <Text style={styles.total}>{formattedTotal}</Text> : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace('/orders')}
          >
            <Text style={styles.primaryBtnText}>Acompanhar pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.outlineBtnText}>Voltar à loja</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  orderId: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 4,
  },
  total: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
});
