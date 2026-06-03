import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth';
import { colors } from '@/constants/colors';

export default function RegisterClientScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validate() {
    if (!name.trim()) return 'Informe seu nome.';
    if (!email.trim() || !email.includes('@')) return 'E-mail inválido.';
    if (!phone.trim()) return 'Informe seu telefone.';
    if (password.length < 6) return 'Senha deve ter ao menos 6 caracteres.';
    if (password !== confirmPassword) return 'As senhas não coincidem.';
    return null;
  }

  async function handleRegister() {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      const user = await signUp({ name: name.trim(), email: email.trim(), phone, password, role: 'client' });
      router.replace('/home');
    } catch (e: any) {
      setError(e.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Acesso para compradores</Text>

          <Field label="Nome completo">
            <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} autoCapitalize="words" />
          </Field>
          <Field label="E-mail">
            <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </Field>
          <Field label="Telefone">
            <TextInput style={styles.input} placeholder="(11) 99999-9999" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </Field>
          <Field label="Senha">
            <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
          </Field>
          <Field label="Confirmar senha">
            <TextInput style={styles.input} placeholder="Repita a senha" placeholderTextColor={colors.textMuted} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          </Field>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnPrimaryText}>Cadastrar</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/login')}>
            <Text style={styles.linkText}>
              Já tenho conta <Text style={styles.linkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={fieldStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
});

const styles = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },
  back: { marginBottom: 20, alignSelf: 'flex-start' },
  title: { fontSize: 30, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: 24 },
  input: {
    backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 13, fontSize: 15, color: colors.textDark, marginBottom: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  errorText: { color: '#E74C3C', fontSize: 13, fontWeight: '500', marginBottom: 12, textAlign: 'center' },
  btnPrimary: {
    backgroundColor: colors.accent, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  linkBtn: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: 14, color: colors.textMid },
  linkBold: { color: colors.accent, fontWeight: '700' },
});
