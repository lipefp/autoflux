import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { token, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D1B2A' }}>
        <ActivityIndicator color="#F4801A" size="large" />
      </View>
    );
  }

  if (token && role === 'client') return <Redirect href="/home" />;
  if (token && role === 'store') return <Redirect href="/dashboard" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
