import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Icon } from "@rneui/themed";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../app/config";

export default function DadosConta() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function carregarDados() {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNome(response.data.nome);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados da conta.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const editar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/perfil/editar`,
        { nome, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    }
  };

  const deletar = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.delete(`${API_BASE_URL}/perfil`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Conta excluída com sucesso!");
              router.replace("/login");
            } catch (error) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/perfil")} style={styles.backButton}>
          <Icon name="arrow-back-ios" type="material" color="#d32f2f" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Conta</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{nome?.[0]?.toUpperCase() || ""}</Text>
          </View>
        </View>

        <Card containerStyle={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />

          <Button
            title="Salvar alterações"
            onPress={editar}
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveTitle}
            containerStyle={{ marginTop: 20 }}
          />

          <Button
            title="Excluir conta"
            onPress={deletar}
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteTitle}
            containerStyle={{ marginTop: 10 }}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

// ... estilos permanecem iguais


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#d32f2f" },
  avatarContainer: { alignItems: "center", marginTop: 30, marginBottom: 15 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#fde4e4", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#d32f2f" },
  card: { borderRadius: 16, padding: 20, backgroundColor: "#fff", elevation: 3, marginHorizontal: 10 },
  label: { fontSize: 14, color: "#666", marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#eee", borderRadius: 10, padding: 12, backgroundColor: "#f9f9f9", fontSize: 16 },
  saveButton: { backgroundColor: "#d32f2f", borderRadius: 10, paddingVertical: 14 },
  saveTitle: { fontWeight: "bold", fontSize: 16 },
  deleteButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#d32f2f", borderRadius: 10, paddingVertical: 14 },
  deleteTitle: { color: "#d32f2f", fontWeight: "bold", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
