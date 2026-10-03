import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PAGAMENTO, cores, formatarPreco, imagemUrl, sombra, statusPedido } from "@/constants/ui";
import { API_BASE_URL } from "../config";

type Pedido = {
  id: number;
  valorTotal: number;
  dataCriacao: string;
  status: string;
  metodoPagamento?: string;
  pagamentoStatus?: string;
  cliente: {
    idUsuario: number;
    email: string;
    nome: string;
    cpf: string;
  };
  restaurante: {
    idRestaurante: number;
    nome: string;
    telefone: string;
    cnpj: string;
    raio_entrega: string;
    urlImagem?: string | null;
    categoria: {
      id: number;
      nome: string;
    };
  };
  itens: {
    id: number;
    quantidade: number;
    subtotal: number;
    produto: {
      idProduto: number;
      nome: string;
      descricao: string;
      preco: number;
      ativo: boolean;
    };
  }[];
};

function formatarData(data: string) {
  if (!data) return "";
  const d = new Date(data);
  return `${d.toLocaleDateString("pt-BR")} às ${d
    .toLocaleTimeString("pt-BR")
    .slice(0, 5)}`;
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const router = useRouter();

  async function fetchPedidos() {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/pedidos/historico/cliente`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPedidos([...response.data].sort((a: Pedido, b: Pedido) => b.id - a.id));
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
      setAtualizando(false);
    }
  }

  // Recarrega sempre que a aba é aberta (ex: logo após fazer um pedido)
  useFocusEffect(
    useCallback(() => {
      fetchPedidos();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.titulo}>Pedidos</Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            tintColor={cores.vermelho}
            onRefresh={() => {
              setAtualizando(true);
              fetchPedidos();
            }}
          />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={cores.vermelho} style={{ marginTop: 24 }} />
        ) : pedidos.length === 0 ? (
          <View style={styles.vazio}>
            <View style={styles.vazioIcone}>
              <Ionicons name="receipt-outline" size={40} color={cores.vermelho} />
            </View>
            <Text style={styles.vazioTitulo}>Você ainda não fez pedidos</Text>
            <Text style={styles.vazioSub}>
              Seus pedidos vão aparecer aqui. Que tal escolher algo gostoso agora?
            </Text>
            <TouchableOpacity style={styles.botao} onPress={() => router.push("/")}>
              <Text style={styles.botaoTexto}>Fazer pedido</Text>
            </TouchableOpacity>
          </View>
        ) : (
          pedidos.map((item) => {
            const st = statusPedido(item.status);
            const logo = imagemUrl(item.restaurante?.urlImagem);
            const qtdItens = item.itens.reduce((s, i) => s + i.quantidade, 0);

            return (
              <View key={item.id} style={styles.card}>
                {/* LOJA */}
                <View style={styles.cardTopo}>
                  {logo ? (
                    <Image source={{ uri: logo }} style={styles.logo} />
                  ) : (
                    <View style={[styles.logo, styles.semImagem]}>
                      <Ionicons name="storefront-outline" size={20} color={cores.textoSuave} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lojaNome} numberOfLines={1}>
                      {item.restaurante.nome}
                    </Text>
                    <Text style={styles.data}>
                      Pedido #{item.id} • {formatarData(item.dataCriacao)}
                    </Text>
                  </View>
                </View>

                {/* STATUS */}
                <View style={[styles.status, { backgroundColor: st.fundo }]}>
                  <Ionicons name={st.icone as any} size={16} color={st.cor} />
                  <Text style={[styles.statusTexto, { color: st.cor }]}>{st.label}</Text>
                </View>

                {/* ITENS */}
                <View style={styles.itens}>
                  {item.itens.map((i) => (
                    <View key={i.id} style={styles.itemLinha}>
                      <Text style={styles.itemQtd}>{i.quantidade}x</Text>
                      <Text style={styles.itemNome} numberOfLines={1}>
                        {i.produto.nome}
                      </Text>
                      <Text style={styles.itemValor}>{formatarPreco(i.subtotal)}</Text>
                    </View>
                  ))}
                </View>

                {/* TOTAL */}
                <View style={styles.rodape}>
                  <View>
                    <Text style={styles.totalLabel}>
                      Total • {qtdItens} {qtdItens === 1 ? "item" : "itens"}
                    </Text>
                    <Text style={styles.total}>{formatarPreco(item.valorTotal)}</Text>
                  </View>
                  {item.metodoPagamento && (
                    <View style={styles.pagamento}>
                      <Ionicons
                        name={
                          item.metodoPagamento === "PIX"
                            ? "qr-code-outline"
                            : item.metodoPagamento === "CARTAO"
                            ? "card-outline"
                            : "cash-outline"
                        }
                        size={14}
                        color={cores.texto}
                      />
                      <Text style={styles.pagamentoTexto}>
                        {PAGAMENTO[item.metodoPagamento] || item.metodoPagamento}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  titulo: {
    fontSize: 26,
    fontWeight: "800",
    color: cores.texto,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  card: {
    backgroundColor: cores.superficie,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...sombra,
  },
  cardTopo: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 12, backgroundColor: cores.fundo },
  semImagem: { alignItems: "center", justifyContent: "center" },
  lojaNome: { fontSize: 16, fontWeight: "700", color: cores.texto },
  data: { fontSize: 12, color: cores.textoSuave, marginTop: 2 },

  status: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  statusTexto: { fontSize: 13, fontWeight: "700" },

  itens: {
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: cores.borda,
    borderStyle: "dashed",
    gap: 6,
  },
  itemLinha: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemQtd: { fontWeight: "700", color: cores.vermelho, minWidth: 24 },
  itemNome: { flex: 1, color: cores.texto, fontSize: 14 },
  itemValor: { color: cores.textoSuave, fontSize: 13 },

  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 12,
  },
  totalLabel: { fontSize: 12, color: cores.textoSuave },
  total: { fontSize: 18, fontWeight: "800", color: cores.texto, marginTop: 2 },
  pagamento: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.fundo,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pagamentoTexto: { fontSize: 12, fontWeight: "600", color: cores.texto },

  vazio: { alignItems: "center", paddingTop: 60, paddingHorizontal: 24 },
  vazioIcone: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: cores.vermelhoClaro,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  vazioTitulo: { fontSize: 19, fontWeight: "800", color: cores.texto, marginBottom: 8 },
  vazioSub: {
    fontSize: 15,
    color: cores.textoSuave,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  botao: {
    backgroundColor: cores.vermelho,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  botaoTexto: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
