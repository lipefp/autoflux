import React, { useState } from 'react';
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
import { createPart } from '@/services/api';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/auth';

export default function PartFormScreen() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [compatible, setCompatible] = useState('');
  const [code, setCode] = useState('');
  const [stock, setStock] = useState('0');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !brand.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, preço e marca.');
      return;
    }
    setSaving(true);
    try {
      await createPart({
        name: name.trim(),
        price: Number(price),
        brand: brand.trim(),
        compatible: compatible.trim(),
        code: code.trim(),
        stock: Number(stock),
        description: description.trim(),
        store_id: user?.store_id ? Number(user.store_id) : undefined,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível salvar a peça.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title="Nova peça" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Filtro de óleo Bosch"
            placeholderTextColor={colors.textLight}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Preço *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Ex: 45.90"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Marca *</Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="Ex: Honda"
            placeholderTextColor={colors.textLight}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Compatível com</Text>
          <TextInput
            style={styles.input}
            value={compatible}
            onChangeText={setCompatible}
            placeholder="Ex: Honda Civic 2018-2023"
            placeholderTextColor={colors.textLight}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Código</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Ex: BOX-3330"
            placeholderTextColor={colors.textLight}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Estoque</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="0"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Detalhes adicionais sobre a peça..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
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
            <Text style={styles.saveBtnText}>Salvar peça</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  inputMultiline: { height: 100, paddingTop: 10 },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});
