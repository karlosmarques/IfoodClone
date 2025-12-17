import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, Card, Icon, ListItem } from "@rneui/themed";
import axios from "axios";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View
} from "react-native";
import { API_BASE_URL } from '../config';

type User = {
  nome: string;
  email: string;
};

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
        <ActivityIndicator size="large" color="#E91E63" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.nome.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Avatar rounded size={100} />

          <Text style={styles.name}>{user?.nome}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </Card>

      <ListItem onPress={() => router.push('/endereco')}>
        <Icon name="location-on" type="material" color="#E91E63" size={28} />
        <ListItem.Content>
          <ListItem.Title>Endereço</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem onPress={() => router.push('/dadosConta')}>
        <Icon name="settings" type="material" color="#1f1f1f" size={28} />
        <ListItem.Content>
          <ListItem.Title>Dados da conta</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <Button
        title="Sair"
        onPress={handleLogout}
        buttonStyle={styles.logoutButton}
        containerStyle={styles.logoutContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fde4e4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#E91E63",
    borderRadius: 8,
    width: 200,
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
