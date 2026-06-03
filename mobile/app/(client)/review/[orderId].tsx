import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { createReview } from '@/services/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export default function ReviewScreen() {
  const { orderId, storeId } = useLocalSearchParams<{ orderId: string; storeId: string }>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (loading || success) return;
    setLoading(true);
    await createReview({
      order: Number(orderId),
      store: Number(storeId),
      rating,
      comment,
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.back(), 1500);
  }

  return (
    <View style={styles.container}>
      <Navbar title="Avaliar loja" showBack />
      <View style={styles.content}>
        <Text style={styles.label}>Sua avaliação</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7}>
              <Ionicons
                name={n <= rating ? 'star' : 'star-outline'}
                size={36}
                color={colors.accent}
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingLabel}>
          {rating === 1 ? 'Muito ruim' :
           rating === 2 ? 'Ruim' :
           rating === 3 ? 'Regular' :
           rating === 4 ? 'Bom' : 'Excelente'}
        </Text>

        <Text style={styles.label}>Comentário</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={5}
          placeholder="Conte sua experiência..."
          placeholderTextColor={colors.textLight}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
          editable={!success}
        />

        {success ? (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={styles.successText}>Avaliação enviada!</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitBtnText}>Enviar avaliação</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      <BottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMid,
    marginBottom: 10,
    marginTop: 8,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 4,
  },
  ratingLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 20,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: colors.textDark,
    minHeight: 120,
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  successText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.success,
  },
});
