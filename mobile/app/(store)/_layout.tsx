import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/auth';

export default function StoreLayout() {
  const { token, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F5F7' }}>
        <ActivityIndicator color="#F4801A" size="large" />
      </View>
    );
  }

  if (!token) return <Redirect href="/welcome" />;
  if (role !== 'store') return <Redirect href="/home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
