import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSacola } from "../context/SacolaContext";
import { API_BASE_URL } from "./config";

export default function Sacola() {
  const { itens, adicionar, remover, total } = useSacola();
  const router = useRouter();
  const [irParaLogin, setIrParaLogin] = useState(false);

  // redireciona para login
  useEffect(() => {
    if (irParaLogin) {
      router.push({
        pathname: "/login",
        params: { redirect: "/sacola" },
      });
      setIrParaLogin(false);
    }
  }, [irParaLogin]);

  const handleFinalizarPedido = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert(
        "Login necessário",
        "Você precisa estar logado para finalizar o pedido.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Entrar", onPress: () => setIrParaLogin(true) },
        ]
      );
      return;
    }

    router.push("/checkout");
  };

  if (itens.length === 0) {
    return (
      <View style={styles.containerVazio}>
        <Text style={styles.emojivazio}>🛒</Text>
        <Text style={styles.vazioTitulo}>Sua sacola está vazia</Text>
        <Text style={styles.vazioSub}>
          Adicione produtos do cardápio para começar seu pedido
        </Text>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.botaoVoltarTexto}>Ver cardápio</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.push("/")}>
    <Text style={styles.voltarIcone}>←</Text>
  </TouchableOpacity>
        <Text style={styles.titulo}>Sacola</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* LISTA DE ITENS */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.listaItens}>
          {itens.map((item) => (
            <View key={item.produto.idProduto} style={styles.itemCard}>
              <Image
                source={{
                  uri: item.produto.urlImagem
                    ? `${API_BASE_URL}${item.produto.urlImagem.replace(/\\/g, "/")}`
                    : "https://via.placeholder.com/80",
                }}
                style={styles.imagem}
              />

              <View style={styles.itemInfo}>
                <Text style={styles.nome} numberOfLines={2}>
                  {item.produto.nome}
                </Text>
                <Text style={styles.precoUnitario}>
                  R$ {item.produto.preco.toFixed(2)} / unidade
                </Text>
                <Text style={styles.precoTotal}>
                  R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                </Text>
              </View>

              <View style={styles.qtdContainer}>
                <TouchableOpacity 
                  onPress={() => remover(item.produto.idProduto)}
                  style={[styles.qtdBotao, item.quantidade === 1 && styles.qtdBotaoDisabled]}
                >
                  <Text style={styles.qtdTexto}>−</Text>
                </TouchableOpacity>

                <Text style={styles.quantidade}>{item.quantidade}</Text>

                <TouchableOpacity 
                  onPress={() => adicionar(item.produto, item.produto.idRestaurante)}
                  style={styles.qtdBotao}
                >
                  <Text style={styles.qtdTexto}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* RESUMO */}
        <View style={styles.resumoCard}>
          <Text style={styles.resumoTitulo}>Resumo do pedido</Text>
          <View style={styles.resumoLinha}>
            <Text style={styles.totalTexto}>Total</Text>
            <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTÃO FIXO */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.botaoFinalizar}
          onPress={handleFinalizarPedido}

        >
          <Text style={styles.botaoFinalizarTexto}>
            Finalizar pedido • R$ {total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  voltarIcone: {
    fontSize: 28,
    color: "#333",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  scrollArea: {
    flex: 1,
  },

  listaItens: {
    padding: 16,
  },

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  imagem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },

  precoUnitario: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },

  precoTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EA1D2C",
  },

  qtdContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  qtdBotao: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#EA1D2C",
    alignItems: "center",
    justifyContent: "center",
  },

  qtdBotaoDisabled: {
    borderColor: "#d0d0d0",
  },

  qtdTexto: {
    fontSize: 20,
    color: "#EA1D2C",
    fontWeight: "600",
  },

  quantidade: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#1a1a1a",
  },

  resumoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  resumoTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },

  resumoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  resumoTexto: {
    fontSize: 14,
    color: "#666",
  },

  resumoValor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  divisor: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },

  totalTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  totalValor: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EA1D2C",
  },

  footerContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },

  botaoFinalizar: {
    backgroundColor: "#EA1D2C",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#EA1D2C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  botaoFinalizarTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  containerVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 32,
  },

  emojivazio: {
    fontSize: 80,
    marginBottom: 16,
  },

  vazioTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },

  vazioSub: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },

  botaoVoltar: {
    backgroundColor: "#EA1D2C",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },

  botaoVoltarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
