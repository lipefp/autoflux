import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function AdminLayout() {
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
        options={{ title: 'Painel', tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="aprovacoes"
        options={{ title: 'Aprovações', tabBarIcon: ({ color }) => <MaterialIcons name="verified" size={26} color={color} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Admin', tabBarIcon: ({ color }) => <MaterialIcons name="admin-panel-settings" size={26} color={color} /> }}
      />
    </Tabs>
  );
}
