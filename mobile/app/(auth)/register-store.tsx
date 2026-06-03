import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth';
import { colors } from '@/constants/colors';

export default function RegisterStoreScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [hours, setHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validate() {
    if (!name.trim()) return 'Informe o nome da loja.';
    if (!cnpj.trim()) return 'Informe o CNPJ.';
    if (!email.trim() || !email.includes('@')) return 'E-mail inválido.';
    if (!phone.trim()) return 'Informe o telefone.';
    if (password.length < 6) return 'Senha deve ter ao menos 6 caracteres.';
    if (!city.trim()) return 'Informe a cidade.';
    return null;
  }

  async function handleRegister() {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        phone,
        password,
        role: 'store',
        cnpj,
      });
      router.replace('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Erro ao cadastrar loja.');
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

          <Text style={styles.title}>Cadastrar loja</Text>
          <Text style={styles.subtitle}>Venda suas autopeças no AutoFlux</Text>

          <SectionTitle label="Dados da loja" />
          <Field label="Nome da loja">
            <TextInput style={styles.input} placeholder="Ex: AutoCenter SP" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
          </Field>
          <Field label="CNPJ">
            <TextInput style={styles.input} placeholder="00.000.000/0001-00" placeholderTextColor={colors.textMuted} value={cnpj} onChangeText={setCnpj} keyboardType="numeric" />
          </Field>

          <SectionTitle label="Contato" />
          <Field label="E-mail">
            <TextInput style={styles.input} placeholder="loja@email.com" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </Field>
          <Field label="Telefone">
            <TextInput style={styles.input} placeholder="(11) 3333-4444" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </Field>
          <Field label="Senha">
            <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
          </Field>

          <SectionTitle label="Endereço" />
          <Field label="Endereço">
            <TextInput style={styles.input} placeholder="Rua, número" placeholderTextColor={colors.textMuted} value={address} onChangeText={setAddress} />
          </Field>
          <Field label="Bairro">
            <TextInput style={styles.input} placeholder="Bairro" placeholderTextColor={colors.textMuted} value={district} onChangeText={setDistrict} />
          </Field>
          <Field label="Cidade *">
            <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor={colors.textMuted} value={city} onChangeText={setCity} />
          </Field>
          <Field label="Horário de funcionamento">
            <TextInput style={styles.input} placeholder="Ex: Seg-Sex 8h às 18h" placeholderTextColor={colors.textMuted} value={hours} onChangeText={setHours} />
          </Field>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnPrimaryText}>Cadastrar loja</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/login?role=store')}>
            <Text style={styles.linkText}>
              Já tenho cadastro <Text style={styles.linkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <Text style={sectionStyle.text}>{label}</Text>;
}

const sectionStyle = StyleSheet.create({
  text: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 8, marginBottom: 8 },
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={fieldStyle.label}>{label}</Text>
      {children}
    </View>
  );
}

const fieldStyle = StyleSheet.create({
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
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  linkBtn: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: 14, color: colors.textMid },
  linkBold: { color: colors.accent, fontWeight: '700' },
});
