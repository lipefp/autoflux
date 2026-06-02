import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="detail/[id]" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0D1B2A" />
    </CartProvider>
  );
}
