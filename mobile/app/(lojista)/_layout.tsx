import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function LojistaTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: { backgroundColor: Colors.white, borderTopColor: Colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <MaterialIcons name="bar-chart" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="catalogo"
        options={{ title: 'Catálogo', tabBarIcon: ({ color }) => <MaterialIcons name="inventory" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{ title: 'Pedidos', tabBarIcon: ({ color }) => <MaterialIcons name="receipt-long" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: ({ color }) => <MaterialIcons name="store" size={26} color={color} /> }}
      />
    </Tabs>
  );
}
