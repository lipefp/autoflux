import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth';
import { colors } from '@/constants/colors';
import type { UserRole } from '@/contexts/auth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>((params.role as UserRole) || 'client');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Preencha email e senha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await signIn(email.trim(), password);
      router.replace(user.role === 'store' ? '/dashboard' : '/home');
    } catch (err: any) {
      setError(err.message || 'Email ou senha incorretos.');
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

          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta AutoFlux</Text>

          {/* Toggle de perfil */}
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'client' && styles.roleBtnActive]}
              onPress={() => setRole('client')}
            >
              <Ionicons name="person-outline" size={16} color={role === 'client' ? colors.white : colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'store' && styles.roleBtnActive]}
              onPress={() => setRole('store')}
            >
              <Ionicons name="storefront-outline" size={16} color={role === 'store' ? colors.white : colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={[styles.roleText, role === 'store' && styles.roleTextActive]}>Lojista</Text>
            </TouchableOpacity>
          </View>

          {/* E-mail */}
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Senha */}
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Erro */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Botão entrar */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnPrimaryText}>Entrar</Text>
            }
          </TouchableOpacity>

          {/* Criar conta */}
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.push(role === 'store' ? '/register-store' : '/register-client')}
          >
            <Text style={styles.linkText}>
              Não tem conta? <Text style={styles.linkBold}>Criar conta</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: colors.textMuted }]}>Esqueci minha senha</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },
  back: { marginBottom: 20, alignSelf: 'flex-start' },
  title: { fontSize: 30, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: 28 },

  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 10, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.white,
  },
  roleBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  roleText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  roleTextActive: { color: colors.white },

  label: { fontSize: 13, fontWeight: '600', color: colors.textMid, marginBottom: 6 },
  input: {
    backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 13, fontSize: 15, color: colors.textDark, marginBottom: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 10,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16,
    paddingHorizontal: 14,
  },
  passwordInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: colors.textDark },
  eyeBtn: { padding: 4 },

  errorText: {
    color: '#E74C3C', fontSize: 13, fontWeight: '500',
    marginBottom: 12, textAlign: 'center',
  },

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
