import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cores, formatarPreco, imagemUrl, sombra } from "../constants/ui";
import { useSacola } from "../context/SacolaContext";

export default function Sacola() {
  const { itens, adicionar, remover, total, idRestaurante } = useSacola();
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

  const voltarParaLoja = () => {
    if (idRestaurante) {
      router.push({ pathname: "/ProdutosRestaurante", params: { id: idRestaurante } });
    } else {
      router.push("/");
    }
  };

  const Header = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={cores.texto} />
      </TouchableOpacity>
      <Text style={styles.titulo}>Sacola</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  if (itens.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        {Header}
        <View style={styles.vazio}>
          <View style={styles.vazioIcone}>
            <Ionicons name="bag-handle-outline" size={44} color={cores.vermelho} />
          </View>
          <Text style={styles.vazioTitulo}>Sua sacola está vazia</Text>
          <Text style={styles.vazioSub}>
            Adicione itens do cardápio de uma loja para começar seu pedido.
          </Text>
          <TouchableOpacity style={styles.botaoPrimario} onPress={() => router.push("/")}>
            <Text style={styles.botaoPrimarioTexto}>Explorar lojas</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {Header}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* ITENS */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Itens adicionados</Text>

          {itens.map((item, index) => {
            const img = imagemUrl(item.produto.urlImagem);
            return (
              <View
                key={item.produto.idProduto}
                style={[styles.item, index === itens.length - 1 && { borderBottomWidth: 0 }]}
              >
                {img ? (
                  <Image source={{ uri: img }} style={styles.imagem} />
                ) : (
                  <View style={[styles.imagem, styles.semImagem]}>
                    <Ionicons name="image-outline" size={22} color={cores.textoSuave} />
                  </View>
                )}

                <View style={styles.itemInfo}>
                  <Text style={styles.nome} numberOfLines={2}>
                    {item.produto.nome}
                  </Text>
                  <Text style={styles.precoTotal}>
                    {formatarPreco(item.produto.preco * item.quantidade)}
                  </Text>
                </View>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    onPress={() => remover(item.produto.idProduto)}
                    style={styles.stepperBotao}
                  >
                    <Ionicons
                      name={item.quantidade === 1 ? "trash-outline" : "remove"}
                      size={18}
                      color={cores.vermelho}
                    />
                  </TouchableOpacity>
                  <Text style={styles.quantidade}>{item.quantidade}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      adicionar(item.produto, (item.produto as any).idRestaurante ?? idRestaurante!)
                    }
                    style={styles.stepperBotao}
                  >
                    <Ionicons name="add" size={18} color={cores.vermelho} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.adicionarMais} onPress={voltarParaLoja}>
            <Ionicons name="add-circle-outline" size={18} color={cores.vermelho} />
            <Text style={styles.adicionarMaisTexto}>Adicionar mais itens</Text>
          </TouchableOpacity>
        </View>

        {/* RESUMO */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={styles.cardTitulo}>Resumo de valores</Text>
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoTexto}>Subtotal ({quantidadeTotal} itens)</Text>
            <Text style={styles.resumoValor}>{formatarPreco(total)}</Text>
          </View>
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoTexto}>Taxa de entrega</Text>
            <Text style={[styles.resumoValor, { color: cores.verde }]}>Grátis</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.resumoLinha}>
            <Text style={styles.totalTexto}>Total</Text>
            <Text style={styles.totalValor}>{formatarPreco(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTÃO FIXO */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.botaoFinalizar} onPress={handleFinalizarPedido}>
          <Text style={styles.botaoFinalizarTexto}>Escolher pagamento</Text>
          <Text style={styles.botaoFinalizarTexto}>{formatarPreco(total)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },

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

  card: {
    backgroundColor: cores.superficie,
    borderRadius: 18,
    padding: 16,
    ...sombra,
  },
  cardTitulo: { fontSize: 16, fontWeight: "800", color: cores.texto, marginBottom: 8 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  imagem: { width: 56, height: 56, borderRadius: 12, backgroundColor: cores.fundo },
  semImagem: { alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1, marginHorizontal: 12 },
  nome: { fontSize: 15, fontWeight: "600", color: cores.texto, marginBottom: 4 },
  precoTotal: { fontSize: 15, fontWeight: "800", color: cores.texto },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    height: 38,
  },
  stepperBotao: { width: 34, height: "100%", alignItems: "center", justifyContent: "center" },
  quantidade: { fontSize: 15, fontWeight: "700", minWidth: 20, textAlign: "center" },

  adicionarMais: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 14,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  adicionarMaisTexto: { color: cores.vermelho, fontWeight: "700", fontSize: 15 },

  resumoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  resumoTexto: { fontSize: 14, color: cores.textoSuave },
  resumoValor: { fontSize: 14, fontWeight: "600", color: cores.texto },
  divisor: { height: 1, backgroundColor: cores.borda, marginTop: 12, marginBottom: 4 },
  totalTexto: { fontSize: 16, fontWeight: "800", color: cores.texto },
  totalValor: { fontSize: 18, fontWeight: "800", color: cores.texto },

  footer: {
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

  vazio: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  vazioIcone: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: cores.vermelhoClaro,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  vazioTitulo: { fontSize: 20, fontWeight: "800", color: cores.texto, marginBottom: 8 },
  vazioSub: {
    fontSize: 15,
    color: cores.textoSuave,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  botaoPrimario: {
    backgroundColor: cores.vermelho,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  botaoPrimarioTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
