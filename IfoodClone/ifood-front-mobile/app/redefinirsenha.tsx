import { Button, Input, Text } from "@rneui/themed";
import axios from "axios";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { API_BASE_URL } from "../app/config";




export default function RedefinirSenha() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRedefinir() {
    setErro("");
    setMensagem("");

    if (!token) {
      return setErro("Token inválido ou expirado.");
    }

    if (!novaSenha || novaSenha.length < 6) {
      return setErro("A senha deve ter pelo menos 6 caracteres.");
    }

    if (novaSenha !== confirmarSenha) {
      return setErro("As senhas não coincidem.");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/redefinirsenha`,
        {
          token,
          novaSenha,
        }
      );

      setMensagem(response.data?.message || "Senha redefinida com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err: any) {
      console.error(err?.response?.data || err.message);
      setErro(
        err?.response?.data?.message ||
          "Erro ao redefinir senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Redefinir Senha
      </Text>

      <Input
        placeholder="Nova senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <Input
        placeholder="Confirmar nova senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}
      {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}

      <Button
        title="Salvar nova senha"
        loading={loading}
        onPress={handleRedefinir}
        buttonStyle={styles.button}
      />

      <View style={styles.linksContainer}>
        <Link href="/login" style={styles.link}>
          Voltar para o login
        </Link>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#E60014",
    borderRadius: 8,
    paddingVertical: 12,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  linksContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  link: {
    color: "#E60014",
    fontWeight: "bold",
  },
});
