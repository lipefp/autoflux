import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { getStoreById, updateStore } from '@/services/api';
import Navbar from '@/components/Navbar';
import StoreBottomNav from '@/components/StoreBottomNav';
import { useAuth } from '@/contexts/auth';

export default function StoreProfileScreen() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [hours, setHours] = useState('');
  const [radius, setRadius] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.store_id) {
      setLoading(false);
      return;
    }
    getStoreById(user.store_id).then(data => {
      if (data) {
        setName(data.name ?? '');
        setAddress(data.address ?? '');
        setDistrict(data.district ?? '');
        setCity(data.city ?? '');
        setHours(data.hours ?? '');
        setRadius(data.delivery_radius_km != null ? String(data.delivery_radius_km) : '');
      }
    }).finally(() => setLoading(false));
  }, [user?.store_id]);

  const handleSave = async () => {
    if (!user?.store_id) return;
    setSaving(true);
    try {
      await updateStore(user.store_id, {
        name: name.trim(),
        address: address.trim(),
        district: district.trim(),
        city: city.trim(),
        hours: hours.trim(),
        delivery_radius_km: radius ? Number(radius) : undefined,
      });
      Alert.alert('Perfil atualizado!');
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Deseja mesmo sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/welcome' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title="Perfil da loja" />
      {loading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.field}>
            <Text style={styles.label}>Nome da loja</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: AutoCenter SP"
              placeholderTextColor={colors.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Ex: Rua das Flores, 123"
              placeholderTextColor={colors.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={styles.input}
              value={district}
              onChangeText={setDistrict}
              placeholder="Ex: Centro"
              placeholderTextColor={colors.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Ex: São Paulo"
              placeholderTextColor={colors.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Horário de funcionamento</Text>
            <TextInput
              style={styles.input}
              value={hours}
              onChangeText={setHours}
              placeholder="Ex: Seg-Sex 08h-18h"
              placeholderTextColor={colors.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Raio de entrega (km)</Text>
            <TextInput
              style={styles.input}
              value={radius}
              onChangeText={setRadius}
              placeholder="Ex: 10"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Salvar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutBtnText}>Sair da conta</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      <StoreBottomNav active="store-profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, marginTop: 40 },
  content: { padding: 16, paddingBottom: 40 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMid, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textDark,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  signOutBtn: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});
