import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores, formatarPreco, sombra } from "../constants/ui";
import { useSacola } from "../context/SacolaContext";
import { API_BASE_URL } from "./config";

type MetodoPagamento = "PIX" | "CARTAO" | "DINHEIRO";

const API = API_BASE_URL;

export default function Checkout() {
  const { total, limpar, montarPayload } = useSacola();
  const router = useRouter();

  const [metodoPagamento, setMetodoPagamento] =
    useState<MetodoPagamento | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);

  // Pedido criado que ainda aguarda pagamento no Mercado Pago
  const [pedidoPendente, setPedidoPendente] = useState<number | null>(null);
  const [verificando, setVerificando] = useState(false);
  const polling = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => pararPolling(), []);

  function pararPolling() {
    if (polling.current) {
      clearInterval(polling.current);
      polling.current = null;
    }
  }

  function concluir() {
    pararPolling();
    setPedidoPendente(null);
    setModalSucesso(true);

    setTimeout(() => {
      limpar();
      setModalSucesso(false);
      router.replace("/pedidos");
    }, 2500);
  }

  async function headers() {
    const token = await AsyncStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async function verificarPagamento(pedidoId: number, avisar = false) {
    try {
      setVerificando(true);
      const { data } = await axios.get(`${API}/pagamentos/${pedidoId}/status`, {
        headers: await headers(),
      });

      if (data.pagamentoStatus === "APROVADO") {
        try {
          WebBrowser.dismissBrowser();
        } catch {}
        concluir();
      } else if (data.pagamentoStatus === "RECUSADO") {
        pararPolling();
        Alert.alert(
          "Pagamento recusado",
          "O Mercado Pago recusou o pagamento. Tente novamente."
        );
      } else if (avisar) {
        Alert.alert("Aguardando", "Ainda não identificamos o pagamento.");
      }
    } catch (error: any) {
      if (avisar) {
        Alert.alert("Erro", "Não foi possível verificar o pagamento");
      }
    } finally {
      setVerificando(false);
    }
  }

  async function pagarComMercadoPago(pedidoId: number) {
    const { data } = await axios.post(
      `${API}/pagamentos/${pedidoId}/preferencia`,
      {},
      { headers: await headers() }
    );

    setPedidoPendente(pedidoId);

    pararPolling();
    polling.current = setInterval(() => verificarPagamento(pedidoId), 4000);

    // Abre o Checkout Pro (PIX ou cartão) no navegador
    await WebBrowser.openBrowserAsync(data.urlPagamento);

    // No celular, a promise resolve quando o usuário fecha o navegador
    verificarPagamento(pedidoId);
  }

  async function finalizarPedido() {
    if (!metodoPagamento) {
      Alert.alert("Atenção", "Selecione uma forma de pagamento");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Você precisa estar logado");
        setLoading(false);
        return;
      }

      // Já existe um pedido aguardando pagamento: só gera um novo link
      if (pedidoPendente && metodoPagamento !== "DINHEIRO") {
        await pagarComMercadoPago(pedidoPendente);
        return;
      }

      const payload = montarPayload();
      if (!payload) {
        Alert.alert("Erro", "Sua sacola está vazia");
        setLoading(false);
        return;
      }

      const { data: pedido } = await axios.post(
        `${API}/pedidos`,
        { ...payload, metodoPagamento },
        { headers: await headers() }
      );

      if (metodoPagamento === "DINHEIRO") {
        concluir();
      } else {
        await pagarComMercadoPago(pedido.id);
      }
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível finalizar o pedido"
      );
    } finally {
      setLoading(false);
    }
  }

  const opcoes: {
    id: MetodoPagamento;
    titulo: string;
    sub: string;
    icone: React.ComponentProps<typeof Ionicons>["name"];
  }[] = [
    { id: "PIX", titulo: "PIX", sub: "Aprovação na hora pelo Mercado Pago", icone: "qr-code-outline" },
    { id: "CARTAO", titulo: "Cartão de crédito", sub: "Pague online pelo Mercado Pago", icone: "card-outline" },
    { id: "DINHEIRO", titulo: "Dinheiro", sub: "Pague ao receber o pedido", icone: "cash-outline" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.voltar} onPress={() => router.push("/sacola")}>
          <Ionicons name="arrow-back" size={22} color={cores.texto} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Pagamento</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitulo}>Como você quer pagar?</Text>

        <View style={styles.card}>
          {opcoes.map((o, index) => {
            const selecionado = metodoPagamento === o.id;
            return (
              <TouchableOpacity
                key={o.id}
                style={[
                  styles.opcao,
                  index === opcoes.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => setMetodoPagamento(o.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.opcaoIcone, selecionado && styles.opcaoIconeAtivo]}>
                  <Ionicons
                    name={o.icone}
                    size={22}
                    color={selecionado ? cores.vermelho : cores.texto}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.opcaoTexto}>{o.titulo}</Text>
                  <Text style={styles.opcaoSub}>{o.sub}</Text>
                </View>
                <View style={[styles.radio, selecionado && styles.radioAtivo]}>
                  {selecionado && <View style={styles.radioMiolo} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {pedidoPendente && (
          <View style={[styles.card, styles.cardPendente]}>
            <View style={styles.pendenteTopo}>
              <ActivityIndicator color={cores.vermelho} />
              <Text style={styles.pendenteTitulo}>Aguardando pagamento</Text>
            </View>
            <Text style={styles.pendenteTexto}>
              Pedido #{pedidoPendente} criado. Conclua o pagamento na página do
              Mercado Pago. A confirmação é automática.
            </Text>

            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={() => verificarPagamento(pedidoPendente, true)}
              disabled={verificando}
            >
              {verificando ? (
                <ActivityIndicator color={cores.vermelho} />
              ) : (
                <Text style={styles.botaoSecundarioTexto}>Já paguei, verificar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoTexto}>Subtotal</Text>
            <Text style={styles.resumoValor}>{formatarPreco(total)}</Text>
          </View>
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoTexto}>Taxa de entrega</Text>
            <Text style={[styles.resumoValor, { color: cores.verde }]}>Grátis</Text>
          </View>
          <View style={[styles.resumoLinha, styles.resumoTotal]}>
            <Text style={styles.totalTexto}>Total</Text>
            <Text style={styles.totalTexto}>{formatarPreco(total)}</Text>
          </View>
        </View>

        <View style={styles.seguro}>
          <Ionicons name="lock-closed" size={14} color={cores.textoSuave} />
          <Text style={styles.seguroTexto}>Pagamento online processado pelo Mercado Pago</Text>
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.botaoFinalizar, (!metodoPagamento || loading) && { opacity: 0.6 }]}
          onPress={finalizarPedido}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.botaoFinalizarTexto}>
                {pedidoPendente ? "Abrir pagamento" : "Fazer pedido"}
              </Text>
              <Text style={styles.botaoFinalizarTexto}>{formatarPreco(total)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={modalSucesso} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalIcone}>
              <Ionicons name="checkmark" size={44} color="#fff" />
            </View>
            <Text style={styles.modalTitulo}>Pedido confirmado!</Text>
            <Text style={styles.modalTexto}>
              {metodoPagamento === "DINHEIRO"
                ? "O pedido foi enviado ao restaurante. Pague na entrega."
                : "O pagamento foi aprovado e o pedido foi enviado ao restaurante."}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: cores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  voltar: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 18, fontWeight: "800", color: cores.texto },

  /* CONTENT */
  content: { padding: 16 },
  subtitulo: { fontSize: 18, fontWeight: "800", color: cores.texto, marginBottom: 12 },

  card: {
    backgroundColor: cores.superficie,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    ...sombra,
  },

  opcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  opcaoIcone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.fundo,
    alignItems: "center",
    justifyContent: "center",
  },
  opcaoIconeAtivo: { backgroundColor: cores.vermelhoClaro },
  opcaoTexto: { fontSize: 15, fontWeight: "700", color: cores.texto },
  opcaoSub: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#C8C8CF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioAtivo: { borderColor: cores.vermelho },
  radioMiolo: { width: 10, height: 10, borderRadius: 5, backgroundColor: cores.vermelho },

  cardPendente: {
    marginTop: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#FFD6D9",
  },
  pendenteTopo: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  pendenteTitulo: { fontSize: 16, fontWeight: "800", color: cores.texto },
  pendenteTexto: { color: cores.textoSuave, marginBottom: 12, lineHeight: 20 },
  botaoSecundario: {
    borderWidth: 1.5,
    borderColor: cores.vermelho,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoSecundarioTexto: { color: cores.vermelho, fontWeight: "700", fontSize: 15 },

  resumoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  resumoTexto: { fontSize: 14, color: cores.textoSuave },
  resumoValor: { fontSize: 14, fontWeight: "600", color: cores.texto },
  resumoTotal: { borderTopWidth: 1, borderTopColor: cores.borda, marginTop: 4, paddingVertical: 12 },
  totalTexto: { fontSize: 16, fontWeight: "800", color: cores.texto },

  seguro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  seguroTexto: { fontSize: 12, color: cores.textoSuave },

  /* FOOTER FIXO */
  footerContainer: {
    padding: 16,
    backgroundColor: cores.superficie,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  botaoFinalizar: {
    backgroundColor: cores.vermelho,
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  botaoFinalizarTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 24,
    alignItems: "center",
    maxWidth: 360,
    width: "100%",
  },
  modalIcone: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: cores.verde,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitulo: { fontSize: 22, fontWeight: "800", marginTop: 16, color: cores.texto },
  modalTexto: { textAlign: "center", marginTop: 8, color: cores.textoSuave, lineHeight: 21 },
});
