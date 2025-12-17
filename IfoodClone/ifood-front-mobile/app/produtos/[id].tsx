import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSacola } from "../../context/SacolaContext";
import { API_BASE_URL } from "../config";

export default function DetalheProduto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);

  const { adicionar } = useSacola();

  const preco = produto ? Number(produto.preco) : 0;
  const valorTotal = preco * quantidade;

  async function carregarProduto() {
    try {
      const resp = await axios.get(`${API_BASE_URL}/produtos/detalhe/${id}`);
      setProduto(resp.data);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProduto();
  }, [id]);

  function diminuir() {
    if (quantidade > 1) setQuantidade((q) => q - 1);
  }

  function aumentar() {
    setQuantidade((q) => q + 1);
  }

  if (loading) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#EA1D2C" />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.erroTexto}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ===== HEADER FIXO ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltarIcone}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitulo}>Detalhes</Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 56 }}
      >
        <Image
          source={{
            uri: produto.urlImagem
              ? `${API_BASE_URL}${produto.urlImagem.replace(/\\/g, "/")}`
              : "https://via.placeholder.com/400x300",
          }}
          style={styles.produtoImagem}
        />

        <View style={styles.content}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
          <Text style={styles.preco}>R$ {preco.toFixed(2)}</Text>
        </View>
      </ScrollView>

        </View>

  
     
    
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /* HEADER */
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
    elevation: 6,
  },

  voltarIcone: {
    fontSize: 28,
    color: "#333",
  },

  headerTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  /* CONTENT */
  produtoImagem: { width: "100%", height: 260, backgroundColor: "#eee" },
  content: { padding: 20 },

  nome: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  descricao: { fontSize: 16, color: "#555", marginBottom: 20 },
  preco: { fontSize: 22, fontWeight: "700", color: "#EA1D2C" },

  /* FOOTER */
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  qtdBotao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EA1D2C",
    alignItems: "center",
    justifyContent: "center",
  },

  qtdBotaoDisabled: { opacity: 0.4 },
  qtdTexto: { fontSize: 22, color: "#EA1D2C", fontWeight: "600" },
  qtdNumero: { marginHorizontal: 16, fontSize: 18, fontWeight: "600" },

  botaoAdd: {
    backgroundColor: "#EA1D2C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  botaoTexto: { color: "#fff", fontSize: 18, fontWeight: "600" },

  centralizado: { flex: 1, justifyContent: "center", alignItems: "center" },
  erroTexto: { fontSize: 18, color: "#666" },
});
