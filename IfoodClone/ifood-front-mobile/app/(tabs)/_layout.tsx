import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { cores } from '@/constants/ui';

type NomeIcone = React.ComponentProps<typeof Ionicons>['name'];

function icone(ativo: NomeIcone, inativo: NomeIcone) {
  function TabIcon({ color, focused }: { color: string; focused: boolean }) {
    return <Ionicons name={focused ? ativo : inativo} color={color} size={24} />;
  }
  return TabIcon;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: cores.vermelho,
        tabBarInactiveTintColor: '#8A8A93',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          display: 'flex', // visível após Splash
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: icone('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="busca"
        options={{ title: 'Busca', tabBarIcon: icone('search', 'search-outline') }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{ title: 'Pedidos', tabBarIcon: icone('receipt', 'receipt-outline') }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: icone('person', 'person-outline') }}
      />
    </Tabs>
  );
}
