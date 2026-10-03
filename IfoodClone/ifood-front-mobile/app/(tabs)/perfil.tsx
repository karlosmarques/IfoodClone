import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, sombra } from '@/constants/ui';
import { API_BASE_URL } from '../config';

type User = {
  nome: string;
  email: string;
};

type ItemMenu = {
  icone: React.ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  sub: string;
  rota: string;
};

const MENU: ItemMenu[] = [
  { icone: 'receipt-outline', titulo: 'Meus pedidos', sub: 'Acompanhe seus pedidos', rota: '/pedidos' },
  { icone: 'location-outline', titulo: 'Endereço', sub: 'Onde você recebe seus pedidos', rota: '/endereco' },
  { icone: 'person-outline', titulo: 'Dados da conta', sub: 'Nome, e-mail, CPF e telefone', rota: '/dadosConta' },
];

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    verificarAuth();
  }, []);

  async function verificarAuth() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser({
        nome: response.data.nome,
        email: response.data.email,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      await AsyncStorage.removeItem("token");
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("token");
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      router.replace('/login');
    } catch {
      Alert.alert("Erro", "Não foi possível sair da conta");
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={cores.vermelho} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.titulo}>Perfil</Text>

        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nome?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{user?.nome}</Text>
            <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          {MENU.map((item, index) => (
            <TouchableOpacity
              key={item.rota}
              style={[styles.menuItem, index === MENU.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => router.push(item.rota as any)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcone}>
                <Ionicons name={item.icone} size={22} color={cores.texto} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitulo}>{item.titulo}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C8C8CF" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.sair} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={cores.vermelho} />
          <Text style={styles.sairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: cores.fundo },
  titulo: { fontSize: 26, fontWeight: "800", color: cores.texto, marginBottom: 16 },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: cores.superficie,
    borderRadius: 18,
    padding: 16,
    ...sombra,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cores.vermelho,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: "#fff" },
  name: { fontSize: 19, fontWeight: "800", color: cores.texto },
  email: { fontSize: 14, color: cores.textoSuave, marginTop: 2 },

  menu: {
    marginTop: 16,
    backgroundColor: cores.superficie,
    borderRadius: 18,
    paddingHorizontal: 16,
    ...sombra,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  menuIcone: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: cores.fundo,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitulo: { fontSize: 15, fontWeight: "700", color: cores.texto },
  menuSub: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },

  sair: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F5C2C7",
    backgroundColor: cores.superficie,
  },
  sairTexto: { color: cores.vermelho, fontWeight: "700", fontSize: 15 },
});
