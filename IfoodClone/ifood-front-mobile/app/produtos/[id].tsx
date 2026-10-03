import { Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { cores, formatarPreco, imagemUrl, sombra } from "../../constants/ui";
import { useAdicionarNaSacola, useSacola } from "../../context/SacolaContext";
import { API_BASE_URL } from "../config";

export default function DetalheProduto() {
  const { id, restaurante } = useLocalSearchParams<{ id: string; restaurante?: string }>();
  const router = useRouter();

  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);

  const { idRestaurante } = useSacola();
  const adicionar = useAdicionarNaSacola();

  // A loja vem pela rota; sem ela, usa a loja da sacola
  const restauranteId = Number(restaurante) || idRestaurante;

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

  function adicionarNaSacola() {
    if (!restauranteId) return;
    const ok = adicionar({ ...produto, idRestaurante: restauranteId }, restauranteId, quantidade);
    if (ok) router.back();
  }

  if (loading) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color={cores.vermelho} />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.centralizado}>
        <Ionicons name="sad-outline" size={44} color="#C8C8CF" />
        <Text style={styles.erroTexto}>Produto não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const img = imagemUrl(produto.urlImagem);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imagemBox}>
          {img ? (
            <Image source={{ uri: img }} style={styles.produtoImagem} />
          ) : (
            <View style={[styles.produtoImagem, styles.semImagem]}>
              <Ionicons name="image-outline" size={48} color={cores.textoSuave} />
            </View>
          )}
          <SafeAreaView edges={["top"]} style={styles.topoBotoes}>
            <TouchableOpacity style={styles.botaoRedondo} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={cores.texto} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          {produto.categoria?.nome && (
            <Text style={styles.categoria}>{produto.categoria.nome}</Text>
          )}
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
          <Text style={styles.preco}>{formatarPreco(preco)}</Text>
        </View>
      </ScrollView>

      {/* RODAPÉ: quantidade + adicionar */}
      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={diminuir}
            disabled={quantidade === 1}
            style={styles.stepperBotao}
          >
            <Ionicons
              name="remove"
              size={20}
              color={quantidade === 1 ? "#C8C8CF" : cores.vermelho}
            />
          </TouchableOpacity>
          <Text style={styles.qtdNumero}>{quantidade}</Text>
          <TouchableOpacity onPress={aumentar} style={styles.stepperBotao}>
            <Ionicons name="add" size={20} color={cores.vermelho} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.botaoAdd, !restauranteId && { opacity: 0.5 }]}
          onPress={adicionarNaSacola}
          disabled={!restauranteId}
        >
          <Text style={styles.botaoTexto}>Adicionar</Text>
          <Text style={styles.botaoTexto}>{formatarPreco(valorTotal)}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie },

  imagemBox: { position: "relative" },
  produtoImagem: { width: "100%", height: 300, backgroundColor: cores.fundo },
  semImagem: { alignItems: "center", justifyContent: "center" },
  topoBotoes: { position: "absolute", top: 0, left: 16, paddingTop: 8 },
  botaoRedondo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...sombra,
  },

  content: { padding: 20 },
  categoria: {
    fontSize: 12,
    fontWeight: "700",
    color: cores.textoSuave,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  nome: { fontSize: 24, fontWeight: "800", color: cores.texto, marginBottom: 10 },
  descricao: { fontSize: 15, color: cores.textoSuave, lineHeight: 22, marginBottom: 16 },
  preco: { fontSize: 22, fontWeight: "800", color: cores.texto },

  /* FOOTER */
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    height: 52,
  },
  stepperBotao: { width: 44, height: "100%", alignItems: "center", justifyContent: "center" },
  qtdNumero: { fontSize: 17, fontWeight: "700", minWidth: 24, textAlign: "center" },
  botaoAdd: {
    flex: 1,
    height: 52,
    backgroundColor: cores.vermelho,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },

  centralizado: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  erroTexto: { fontSize: 17, color: cores.textoSuave },
  link: { color: cores.vermelho, fontWeight: "700", fontSize: 16 },
});
