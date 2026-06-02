import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth';
import { Colors } from '@/constants/theme';

type Role = 'cliente' | 'lojista';

export default function Register() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [role, setRole] = useState<Role>('cliente');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !phone || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await signUp({ name, email, phone, password, role, cnpj: role === 'lojista' ? cnpj : undefined });
      Alert.alert('Sucesso', 'Conta criada! Faça login para continuar.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.detail || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Escolha seu perfil</Text>

        <View style={styles.roleRow}>
          {(['cliente', 'lojista'] as Role[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleBtn, role === r && styles.roleBtnActive]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                {r === 'cliente' ? '🧑 Cliente' : '🏪 Lojista'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} placeholder="(11) 99999-9999" placeholderTextColor={Colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />

        {role === 'lojista' && (
          <>
            <Text style={styles.label}>CNPJ</Text>
            <TextInput style={styles.input} placeholder="00.000.000/0001-00" placeholderTextColor={Colors.textMuted} value={cnpj} onChangeText={setCnpj} keyboardType="numeric" />
          </>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.buttonText}>Criar conta</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingBottom: 48 },
  back: { marginBottom: 16 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.textMuted, marginBottom: 24 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.white,
  },
  roleBtnActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '15' },
  roleText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  roleTextActive: { color: Colors.accent },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  input: {
    backgroundColor: Colors.white, borderRadius: 8, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, color: Colors.text, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.accent, borderRadius: 8,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
